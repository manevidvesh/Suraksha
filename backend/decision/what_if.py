from typing import Dict, Any
from backend.services.simulation_service import simulate_relocation

def run_what_if_analysis(habitation: Dict[str, Any], site: Dict[str, Any]) -> Dict[str, Any]:
    """Runs a complete what-if relocation analysis simulation."""
    sim = simulate_relocation(habitation, site)
    return sim.model_dump()
