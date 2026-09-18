import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import {
  Habitation,
  CandidateSite,
  DisasterEvent,
  DataSource,
  RiskWeights,
} from '../types';
import {
  FALLBACK_HABITATIONS,
  FALLBACK_SITES,
  FALLBACK_HISTORY,
  FALLBACK_SOURCES,
} from '../lib/fallbackData';

export function useRiskData() {
  const [habitations, setHabitations] = useState<Habitation[]>(FALLBACK_HABITATIONS);
  const [sites, setSites] = useState<CandidateSite[]>(FALLBACK_SITES);
  const [history, setHistory] = useState<DisasterEvent[]>(FALLBACK_HISTORY);
  const [sources, setSources] = useState<DataSource[]>(FALLBACK_SOURCES);
  const [redZonesGeoJSON, setRedZonesGeoJSON] = useState<any>(null);

  const [selectedHabitationId, setSelectedHabitationId] = useState<string>("H1");
  const [minCap, setMinCap] = useState<number>(0);
  const [weights, setWeights] = useState<RiskWeights>({
    hazard: 30,
    exposure: 25,
    vulnerability: 20,
    history: 15,
    access: 10,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [loadingSites, setLoadingSites] = useState<boolean>(false);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const [flyToTarget, setFlyToTarget] = useState<{ latitude: number; longitude: number; name?: string } | null>(null);

  // Initial load
  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const [habsRes, sitesRes, histRes, srcRes, rzRes] = await Promise.allSettled([
          api.getHabitations(),
          api.getRelocationSites(0),
          api.getDisasterHistory(),
          api.getDataSources(),
          api.getRedZonesGeoJSON(),
        ]);

        if (active) {
          if (habsRes.status === "fulfilled" && habsRes.value.items.length > 0) {
            setHabitations(habsRes.value.items);
            if (!selectedHabitationId) {
              setSelectedHabitationId(habsRes.value.items[0].id);
            }
          }
          if (sitesRes.status === "fulfilled" && sitesRes.value.length > 0) {
            setSites(sitesRes.value);
          }
          if (histRes.status === "fulfilled" && histRes.value.length > 0) {
            setHistory(histRes.value);
          }
          if (srcRes.status === "fulfilled" && srcRes.value.items.length > 0) {
            setSources(srcRes.value.items);
          }
          if (rzRes.status === "fulfilled") {
            setRedZonesGeoJSON(rzRes.value);
          }
        }
      } catch (err: any) {
        if (active) {
          setNetworkError(err.message || "Failed to connect to SURAKSHA FastAPI backend");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialData();
    return () => { active = false; };
  }, []);

  // Recalculate weights with debounce
  useEffect(() => {
    if (habitations.length === 0) return;
    const handler = setTimeout(async () => {
      setIsCalculating(true);
      try {
        const res = await api.calculateRisk(weights);
        setHabitations(res.habitations);
      } catch (err) {
        console.error("Risk recalculation failed:", err);
      } finally {
        setIsCalculating(false);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [weights]);

  // Refetch sites when min capacity filter changes
  useEffect(() => {
    let active = true;
    setLoadingSites(true);
    api.getRelocationSites(minCap)
      .then((data) => {
        if (active) setSites(data);
      })
      .catch((err) => console.error("Filter sites failed:", err))
      .finally(() => {
        if (active) setLoadingSites(false);
      });

    return () => { active = false; };
  }, [minCap]);

  const addHabitation = useCallback((newHab: {
    name: string;
    region: string;
    latitude: number;
    longitude: number;
    hazard?: string;
    pop?: number;
  }) => {
    const id = `H${habitations.length + 1}`;
    const total = weights.hazard + weights.exposure + weights.vulnerability + weights.history + weights.access;
    const f = { hazard: 78, exposure: 68, vulnerability: 72, history: 65, access: 40 };
    const raw =
      f.hazard * weights.hazard +
      f.exposure * weights.exposure +
      f.vulnerability * weights.vulnerability +
      f.history * weights.history +
      f.access * weights.access;
    const score = Math.round(raw / (total || 1));
    const tier = score >= 70 ? "Immediate" : score >= 45 ? "Short-term" : "Medium-term";

    const hab: Habitation = {
      id,
      name: newHab.name,
      region: newHab.region,
      hazard: newHab.hazard || "Landslide & flood",
      pop: newHab.pop || 450,
      latitude: newHab.latitude,
      longitude: newHab.longitude,
      x: 50,
      y: 50,
      f,
      events: 1,
      score,
      tier,
    };

    setHabitations((prev) => [hab, ...prev]);
    setSelectedHabitationId(id);
    setFlyToTarget({ latitude: newHab.latitude, longitude: newHab.longitude, name: newHab.name });

    // Sync to backend asynchronously
    api.createHabitation(hab).catch((err) => console.warn("Background sync failed:", err));
  }, [habitations.length, weights]);

  return {
    habitations,
    sites,
    history,
    sources,
    redZonesGeoJSON,
    selectedHabitationId,
    setSelectedHabitationId,
    minCap,
    setMinCap,
    weights,
    setWeights,
    loading,
    isCalculating,
    loadingSites,
    networkError,
    flyToTarget,
    setFlyToTarget,
    addHabitation,
  };
}
