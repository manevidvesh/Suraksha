# SURAKSHA Mathematical Models & Algorithms

SURAKSHA integrates multiple analytical frameworks across risk assessment, capacity modeling, and spatial decision optimization.

---

## 1. Multi-Criteria Composite Risk Score (MCDA / AHP)

The composite risk score $R \in [0, 100]$ for any habitation is computed via normalized multi-criteria weighting:

$$R = \frac{w_h \cdot H + w_e \cdot E + w_v \cdot V + w_{hi} \cdot Hi + w_a \cdot A}{w_h + w_e + w_v + w_{hi} + w_a}$$

Where:
- $H$: Hazard susceptibility & trigger intensity score $[0, 100]$
- $E$: Population & asset exposure score $[0, 100]$
- $V$: Socio-demographic vulnerability index $[0, 100]$
- $Hi$: Past disaster frequency & recurrence $[0, 100]$
- $A$: Accessibility & egress deficit $[0, 100]$

### Priority Tier Thresholds
- **Immediate Relocation**: $R \ge 70$
- **Short-Term Relocation**: $45 \le R < 70$
- **Medium-Term Monitoring**: $R < 45$

---

## 2. Infrastructure Carrying Capacity & Liebig's Law of the Minimum

Resettlement capacity is strictly bounded by the most constrained public utility dimension:

$$C_{\text{eff}} = \min \left( C_{\text{land}}, C_{\text{water}}, C_{\text{sanitation}}, C_{\text{healthcare}}, C_{\text{schools}} \right)$$

$$\text{Bottleneck Dimension} = \arg\min_{k \in \mathcal{K}} \left( C_k \right)$$

This mathematical constraint ensures that no relocation recommendation exceeds sustainable drinking water, sewage, or medical thresholds.

---

## 3. Spatial Haversine Distance

Transit distance between habitation centroid $(lat_1, lon_1)$ and candidate resettlement site $(lat_2, lon_2)$ is determined by the spherical Haversine formula:

$$d = 2 R \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)} \right)$$

Where $R = 6371.0 \text{ km}$.
