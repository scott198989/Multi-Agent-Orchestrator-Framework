import { AgentId, RoutingDecision, AgentResponse } from './types';
import { AGENTS } from './agents';

// Mock response database for demo problems
const MOCK_RESPONSES: Record<string, Record<AgentId, string>> = {
  // Conveyor Control System problem
  conveyor: {
    conductor: `Analyzing this variable-speed conveyor control challenge...

This problem spans multiple engineering domains:
- **Controls**: Sensor integration and closed-loop speed control
- **Process**: Understanding product flow dynamics and spacing requirements
- **Systems**: Integration with upstream equipment and potential SCADA connectivity
- **Pragmatist**: Implementation approach and failure mode considerations

I'm routing to all four specialists as this requires holistic thinking about automation, physics, architecture, and practical constraints.`,

    controls: `## Recommended Control Architecture

### Sensor Configuration
- **Upstream detection**: Photoelectric through-beam sensor (Banner Q45) at conveyor entry
- **Product presence**: Retro-reflective sensors every 500mm along conveyor length
- **Speed feedback**: Incremental encoder (1024 PPR) on motor shaft

### Control Strategy
\`\`\`
PLC Logic Overview:
1. Detect product entry via upstream sensor
2. Calculate required spacing based on product length (measured via sensor break time)
3. Adjust VFD speed setpoint using PI control
4. Monitor encoder feedback for closed-loop speed verification
\`\`\`

### VFD Configuration
- Use **S-curve acceleration** (0.5s accel, 0.3s decel) to prevent product shifting
- Speed range: 0.2 - 2.0 m/s with 10:1 turndown
- Enable **slip compensation** for varying loads

### Safety Considerations
- E-stop zones at both ends
- Speed monitoring with SIL-2 rated safety relay
- Jam detection via motor current monitoring (>120% for >2s = fault)`,

    process: `## Product Flow Dynamics Analysis

### Critical Process Variables
| Variable | Impact | Recommended Range |
|----------|--------|-------------------|
| Line speed | Throughput | 0.5-1.5 m/s optimal |
| Product gap | Downstream ops | Min 150mm for pick-place |
| Acceleration | Product stability | <0.3 m/s² to prevent sliding |

### Spacing Consistency Factors
1. **Product-to-belt friction**: Varies with weight and material
   - Light products (<0.5kg): May slide during accel/decel
   - Solution: Textured belt surface or vacuum assist

2. **Accumulation effects**: Products bunching at speed transitions
   - Implement **zone control** with independent drive sections
   - Use sensor feedback to detect and correct gaps

### Quality Metrics to Monitor
- Gap standard deviation (target: <20mm)
- Products per minute consistency
- Jam frequency rate`,

    systems: `## Integration Architecture

### Communication Topology
\`\`\`
┌─────────────┐     EtherNet/IP     ┌─────────────┐
│   SCADA     │◄──────────────────►│    PLC      │
└─────────────┘                     └──────┬──────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
              ┌─────▼─────┐          ┌─────▼─────┐          ┌─────▼─────┐
              │   VFD 1   │          │   VFD 2   │          │   VFD 3   │
              │  (Zone 1) │          │  (Zone 2) │          │  (Zone 3) │
              └───────────┘          └───────────┘          └───────────┘
\`\`\`

### Data Architecture
- **Real-time**: Speed setpoints, sensor states (100ms scan)
- **Historical**: Production counts, speed profiles, fault logs
- **OPC-UA server** on PLC for MES integration

### Scalability Considerations
- Design for N+1 zones (easy to add conveyor sections)
- Standardize VFD parameters across zones
- Use **AOI (Add-On Instructions)** for reusable control logic`,

    pragmatist: `## Reality Check

### Cost Estimate
| Item | Unit Cost | Qty | Total |
|------|-----------|-----|-------|
| PLC (CompactLogix) | $2,500 | 1 | $2,500 |
| VFD (1HP) | $400 | 3 | $1,200 |
| Sensors | $150 avg | 8 | $1,200 |
| Engineering | $150/hr | 40 | $6,000 |
| **Total** | | | **~$11,000** |

### Implementation Timeline
- Week 1-2: Detailed design and ordering
- Week 3: Panel build and bench testing
- Week 4: Installation and commissioning
- **Realistic total: 4-5 weeks**

### Risk Factors
⚠️ **High Risk**: Varying product weights may require per-product speed profiles
⚠️ **Medium Risk**: Upstream equipment may not provide consistent feed rate
⚠️ **Low Risk**: Standard components with good availability

### Simpler Alternative
If products are relatively uniform, consider a **fixed-speed conveyor with accumulation zones** instead of variable speed. This reduces complexity by 60% and eliminates VFD tuning issues.`,
  },

  // Extruder Quality Issue problem
  extruder: {
    conductor: `Analyzing this extruder wall thickness inconsistency...

This is primarily a **process troubleshooting** problem, but requires multiple perspectives:
- **Process Engineer**: Root cause analysis of thickness variation
- **Controls Engineer**: Check instrumentation and control loop performance
- **Pragmatist**: Help prioritize investigation steps

Systems Architect is less critical here as this is an existing machine issue, not integration.`,

    controls: `## Control System Diagnostics

### Instrumentation Check
Even with "stable settings," the actual process may vary. Verify:

1. **Pressure Transducer Calibration**
   - Check zero and span against master gauge
   - Look for drift or delayed response
   - Typical failure: sensor reads stable but actual pressure fluctuates

2. **Temperature Control**
   - PID loop performance: Check for oscillation (>±2°C)
   - Heater band condition: Measure resistance, look for hot spots
   - Thermocouple placement: Ensure tip is in melt, not barrel wall

3. **Screw Speed Stability**
   - VFD speed feedback vs command (should be <0.5% deviation)
   - Gearbox wear can cause speed fluctuation
   - Check motor current draw pattern for load variations

### Data Logging Recommendation
Set up high-speed (100ms) logging of:
- Melt pressure (before and after screen pack if applicable)
- All zone temperatures (actual vs setpoint)
- Screw RPM and motor amps
- Haul-off speed

**Correlate against thickness measurements** to identify patterns.`,

    process: `## Root Cause Analysis

### Likely Causes (Probability Ranked)

#### 1. Melt Temperature Non-Uniformity (HIGH - 40%)
Even with stable *setpoints*, actual melt temp varies due to:
- **Shear heating variation**: Different screw speeds = different shear
- **Residence time distribution**: Some material sits longer in barrel
- **Test**: IR thermometer on melt stream; should be within ±3°C

#### 2. Material Variation (HIGH - 30%)
- **Moisture content**: Even 0.1% moisture in nylon causes viscosity swings
- **Regrind ratio inconsistency**: Different thermal history
- **Lot-to-lot variation**: Check MFI of incoming material
- **Test**: Run on 100% virgin material for 2 hours

#### 3. Die Swell Variation (MEDIUM - 15%)
- Melt elasticity changes with temperature and shear history
- Can cause 5-10% thickness variation even with perfect die
- **Test**: Measure thickness immediately at die exit vs after cooling

#### 4. Cooling Asymmetry (MEDIUM - 10%)
- Uneven air ring or water bath flow
- One side cools faster = thickness appears different
- **Test**: Measure at multiple clock positions

### Systematic Investigation Protocol
\`\`\`
Day 1: Material audit (moisture, MFI, regrind %)
Day 2: Temperature mapping (all zones + melt)
Day 3: Pressure stability test (30 min at fixed conditions)
Day 4: Cooling uniformity check
\`\`\``,

    systems: `## Measurement and Data Architecture

While this is primarily a process issue, better data can accelerate troubleshooting:

### Recommended Instrumentation
- **Inline rheometer**: Measures melt viscosity in real-time
- **Ultrasonic thickness gauge**: Continuous measurement vs spot checks
- **Thermal imaging**: Die and cooling zone temperature mapping

### Data Correlation System
\`\`\`
Thickness(t) = f(Tmelt, P, RPM, MaterialLot, Ambient)
\`\`\`

If not already implemented, consider adding:
- Historian trending for all process variables
- Statistical correlation analysis
- Automatic flagging when Cpk drops below threshold`,

    pragmatist: `## Practical Investigation Approach

### Start Simple (Cost: $0)
Before buying any equipment, do these free checks:

1. **Run the same lot of material for a full shift** - eliminates material as variable
2. **Check operator procedures** - are settings actually identical between shifts?
3. **Measure in same location every time** - thickness varies around circumference
4. **Review maintenance logs** - anything changed recently?

### Most Common Root Causes (from experience)
📊 **40% of the time**: It's the material (moisture, contamination, lot variation)
🔧 **25% of the time**: Worn screw/barrel (check compression section for wear)
🌡️ **20% of the time**: Hidden temperature variation (failed heater band, TC drift)
🤷 **15% of the time**: Operator variation or measurement error

### Red Flags to Investigate
- Does it happen at specific times? (Startup, shift change, after breaks)
- Does it correlate with material changes?
- Is it always thick or always thin, or does it oscillate?
- Has anything been "fixed" recently that might have caused this?

### Cost of Investigation
Low-tech approach: 2-3 days of methodical testing (~$2,000 labor)
Adding instrumentation: $5,000-15,000 for inline measurement
If worn screw: $8,000-25,000 for replacement`,
  },

  // PLC vs Microcontroller problem
  retrofit: {
    conductor: `Analyzing this PLC vs microcontroller architecture decision...

This is a **systems architecture** question with significant implications for:
- **Systems Architect**: Communication, integration, scalability
- **Controls Engineer**: I/O handling, programming, reliability
- **Pragmatist**: Cost, timeline, and long-term maintenance

All three perspectives are essential for a sound decision.`,

    controls: `## Controls Engineering Perspective

### PLC Advantages for This Application
| Feature | Why It Matters |
|---------|----------------|
| **24 I/O points** | Well within CompactLogix 5069-L306ER range |
| **16 hr/day operation** | Industrial-rated for continuous duty |
| **Deterministic scan** | Guaranteed response time for safety |
| **Built-in diagnostics** | Fault finding during production |

### Microcontroller Concerns
⚠️ **Reliability**: Industrial environment (EMI, vibration, temperature) requires hardened design
⚠️ **I/O protection**: Need external isolation, fusing, surge protection
⚠️ **Real-time constraints**: RTOS needed for deterministic response
⚠️ **Maintenance**: Custom code harder to troubleshoot by plant technicians

### My Recommendation: PLC
For 16 hr/day production with SCADA integration, the PLC is the right choice. Specifically:

- **Allen-Bradley CompactLogix L306ER** or **Siemens S7-1200**
- 24-point I/O handled with one base unit
- Native EtherNet/IP or Profinet for SCADA
- Approx $3,000-4,000 for controller + I/O

### When Microcontroller Makes Sense
- Prototype or low-volume (< 5 units)
- No existing industrial infrastructure
- Extreme cost constraints
- Custom form factor requirements`,

    process: `## Process Integration Considerations

### Packaging Line Requirements
Typical packaging line control needs:
- **Cycle time consistency**: ±50ms repeatability
- **Recipe management**: Product changeover parameters
- **Quality checkpoints**: Sensor-based verification

### Data Requirements
| Data Type | PLC Handling | MCU Handling |
|-----------|--------------|--------------|
| Real-time I/O | Excellent | Good (with RTOS) |
| Recipe storage | Built-in | External EEPROM |
| Trend data | Via SCADA | Custom logging |
| Alarms | Standard | Must implement |

### Process Historian Integration
If you need to track:
- Cycle counts and rates
- Reject statistics
- OEE metrics

PLC + SCADA is the proven path. MCU requires custom development for each integration.`,

    systems: `## Systems Architecture Analysis

### Integration Requirements
\`\`\`
Existing SCADA ─── [Protocol?] ──── New Controller
                                          │
                                    24 I/O Points
\`\`\`

### Communication Protocol Comparison
| Protocol | PLC Support | MCU Support | Complexity |
|----------|-------------|-------------|------------|
| OPC-UA | Native | Libraries exist | Low/Medium |
| EtherNet/IP | Native | Complex | Low/High |
| Modbus TCP | Native | Easy | Low/Low |
| MQTT | Via gateway | Native | Medium/Low |

### Recommended Architecture: PLC
\`\`\`
┌──────────────┐    EtherNet/IP    ┌──────────────┐
│    SCADA     │◄────────────────►│     PLC      │
│   (Existing) │                   │  (New L306)  │
└──────────────┘                   └──────┬───────┘
                                          │
                                   Local 24-pt I/O
\`\`\`

### Future Scalability
- PLC: Add remote I/O via Point I/O or Flex I/O
- MCU: Requires hardware redesign for expansion
- PLC wins for maintainability and documentation standards`,

    pragmatist: `## Total Cost of Ownership Analysis

### Upfront Costs
| Item | PLC Solution | MCU Solution |
|------|-------------|--------------|
| Controller | $3,500 | $50-200 |
| I/O modules | $1,500 | $500-800 (custom) |
| Enclosure | $800 | $800 |
| Engineering | $8,000 (40 hrs) | $20,000+ (100+ hrs) |
| SCADA integration | $2,000 | $8,000+ (custom driver) |
| **Total** | **~$16,000** | **~$30,000+** |

### 5-Year Operating Costs
| Factor | PLC | MCU |
|--------|-----|-----|
| Spare parts | Standard, available | Custom, long lead |
| Troubleshooting | 1-2 hrs avg | 4-8 hrs avg |
| Documentation | Industry standard | Whatever you wrote |
| Finding talent | Easy | Specialized |

### My Verdict: PLC, No Contest

**The microcontroller is a false economy.** The $3,000 "savings" on hardware costs you:
- 60+ extra engineering hours
- Higher integration risk
- Harder maintenance
- Single-source dependency

### When MCU Might Be Right
✓ Building 100+ identical units (amortize NRE)
✓ No existing infrastructure to integrate with
✓ You have dedicated embedded team
✓ Extreme form factor constraints

For a **single retrofit** with **existing SCADA**: PLC every time.`,
  },
};

// Generic responses for custom problems
const GENERIC_RESPONSES: Record<AgentId, string> = {
  conductor: `Analyzing your problem...

This appears to involve multiple engineering domains. Let me route this to the relevant specialists:
- **Controls Engineer**: For automation and control system aspects
- **Process Engineer**: For material and process optimization
- **Systems Architect**: For integration and architecture concerns
- **Pragmatist**: For practical implementation considerations

Each specialist will provide their domain expertise, and I'll synthesize their insights into actionable recommendations.`,

  controls: `## Controls Engineering Analysis

Based on the problem description, here are my key considerations:

### Control System Approach
- Identify all inputs (sensors, operator controls) and outputs (actuators, indicators)
- Define the control logic requirements and safety interlocks
- Select appropriate control hardware based on I/O count and complexity
- Design for reliability, maintainability, and safety

### Key Questions to Address
1. What are the critical process variables to control?
2. What response time is required?
3. What are the safety requirements?
4. How will this integrate with existing systems?

I recommend a systematic approach starting with clear functional requirements before selecting specific hardware or programming approaches.`,

  process: `## Process Engineering Analysis

Looking at this from a process perspective:

### Key Considerations
- Understand the fundamental physics/chemistry of the process
- Identify critical process parameters and their interactions
- Consider material behavior under process conditions
- Evaluate quality metrics and how process variables affect them

### Investigation Approach
1. Map the process flow and identify control points
2. Establish baseline measurements
3. Identify sources of variation
4. Develop cause-and-effect relationships

### Data-Driven Optimization
- Implement appropriate measurements
- Use statistical methods to identify significant factors
- Validate changes through controlled experiments`,

  systems: `## Systems Architecture Analysis

From an integration and architecture standpoint:

### Integration Considerations
- Define interfaces with existing systems
- Select appropriate communication protocols
- Design for data flow and storage requirements
- Consider security and access control

### Architecture Principles
- Use standard protocols where possible (OPC-UA, REST, MQTT)
- Design for scalability and future expansion
- Document interfaces and data models
- Plan for monitoring and maintenance

### Recommended Approach
1. Map the system boundaries and integration points
2. Define data requirements (real-time vs historical)
3. Select technologies that align with existing infrastructure
4. Plan for testing and validation`,

  pragmatist: `## Practical Reality Check

Let me provide some grounded perspective:

### Key Questions
- What's the realistic budget and timeline?
- Who will maintain this after implementation?
- What are the actual pain points we're solving?
- Is there a simpler approach that achieves 80% of the goal?

### Risk Considerations
- Implementation complexity vs team capabilities
- Integration risk with existing systems
- Ongoing maintenance burden
- Hidden costs (training, documentation, spares)

### Recommendations
- Start with a clear definition of success
- Consider phased implementation
- Plan for contingencies
- Don't over-engineer for hypothetical future needs`,
};

// Routing logic
export function analyzeAndRoute(problem: string): RoutingDecision {
  const lowerProblem = problem.toLowerCase();

  // Keywords for routing
  const controlsKeywords = ['plc', 'sensor', 'control', 'automation', 'vfd', 'drive', 'safety', 'interlock', 'encoder', 'actuator'];
  const processKeywords = ['extru', 'quality', 'material', 'temperature', 'pressure', 'thickness', 'process', 'molding', 'viscosity'];
  const systemsKeywords = ['scada', 'integration', 'communication', 'protocol', 'architecture', 'network', 'database', 'interface'];
  const pragmatistKeywords = ['cost', 'budget', 'timeline', 'tradeoff', 'compare', 'evaluate', 'retrofit', 'upgrade', 'vs'];

  const selectedAgents: AgentId[] = [];
  const reasons: string[] = [];

  if (controlsKeywords.some(k => lowerProblem.includes(k))) {
    selectedAgents.push('controls');
    reasons.push('control systems and automation expertise needed');
  }

  if (processKeywords.some(k => lowerProblem.includes(k))) {
    selectedAgents.push('process');
    reasons.push('process and material knowledge required');
  }

  if (systemsKeywords.some(k => lowerProblem.includes(k))) {
    selectedAgents.push('systems');
    reasons.push('integration and architecture decisions involved');
  }

  if (pragmatistKeywords.some(k => lowerProblem.includes(k))) {
    selectedAgents.push('pragmatist');
    reasons.push('practical constraints and trade-offs to evaluate');
  }

  // If no specific routing, include all specialists
  if (selectedAgents.length === 0) {
    selectedAgents.push('controls', 'process', 'systems', 'pragmatist');
    reasons.push('comprehensive analysis needed - engaging all specialists');
  }

  // Always include pragmatist for reality checks if more than one other specialist
  if (selectedAgents.length > 1 && !selectedAgents.includes('pragmatist')) {
    selectedAgents.push('pragmatist');
    reasons.push('adding practical reality check');
  }

  return {
    selectedAgents,
    reasoning: `Based on problem analysis: ${reasons.join('; ')}.`,
    problemType: determineProblemType(lowerProblem),
  };
}

function determineProblemType(problem: string): string {
  if (problem.includes('design') || problem.includes('new')) return 'Design & Implementation';
  if (problem.includes('why') || problem.includes('troubleshoot') || problem.includes('issue')) return 'Troubleshooting';
  if (problem.includes('evaluate') || problem.includes('compare') || problem.includes('tradeoff')) return 'Evaluation & Decision';
  if (problem.includes('optimize') || problem.includes('improve')) return 'Optimization';
  return 'General Engineering';
}

// Get mock response for an agent
export function getMockResponse(problem: string, agentId: AgentId): string {
  // Check if this matches a demo problem
  const lowerProblem = problem.toLowerCase();

  if (lowerProblem.includes('conveyor') && lowerProblem.includes('variable')) {
    return MOCK_RESPONSES.conveyor[agentId];
  }

  if (lowerProblem.includes('extruder') && lowerProblem.includes('thickness')) {
    return MOCK_RESPONSES.extruder[agentId];
  }

  if ((lowerProblem.includes('plc') || lowerProblem.includes('microcontroller')) &&
      (lowerProblem.includes('tradeoff') || lowerProblem.includes('packaging'))) {
    return MOCK_RESPONSES.retrofit[agentId];
  }

  // Return generic response for unknown problems
  return GENERIC_RESPONSES[agentId];
}

// Generate synthesis from agent responses
export function generateSynthesis(
  problem: string,
  responses: AgentResponse[]
): string {
  const lowerProblem = problem.toLowerCase();

  // Demo-specific syntheses
  if (lowerProblem.includes('conveyor')) {
    return `## Synthesized Recommendation: Variable-Speed Conveyor Control

### Executive Summary
The team recommends a **zone-based control architecture** using a CompactLogix PLC with VFD-driven conveyor sections.

### Key Design Elements
1. **Sensor Array**: Through-beam photoelectric for entry detection, retro-reflective for zone presence, encoder for speed feedback
2. **Control Logic**: PI-based speed control with S-curve acceleration profiles to prevent product shifting
3. **Zone Architecture**: Three independent drive zones for flexible spacing control
4. **Integration**: EtherNet/IP backbone connecting to existing SCADA

### Resolution of Specialist Inputs
- **Controls + Process alignment**: Both agree on max 0.3 m/s² acceleration for product stability
- **Systems + Pragmatist alignment**: Standard EtherNet/IP chosen over more complex options for maintainability
- **Risk mitigation**: Per the Pragmatist, implement jam detection and consider fixed-speed fallback mode

### Implementation Path
1. Detailed I/O design and VFD sizing (Week 1-2)
2. PLC programming and bench test (Week 3)
3. Installation and commissioning (Week 4)
4. Production validation (Week 5)

**Estimated Investment**: ~$11,000 including engineering`;
  }

  if (lowerProblem.includes('extruder')) {
    return `## Synthesized Recommendation: Extruder Thickness Investigation

### Root Cause Hypothesis
Based on specialist analysis, the most likely causes in order of probability:
1. **Melt temperature non-uniformity** (40%) - shear heating variation
2. **Material inconsistency** (30%) - moisture or lot variation
3. **Die swell variation** (15%) - melt elasticity changes
4. **Cooling asymmetry** (10%) - uneven heat removal

### Immediate Actions (This Week)
1. ✅ Run 2-hour test on 100% virgin material from single lot
2. ✅ Check moisture content of current material
3. ✅ Verify thermocouple calibration all zones
4. ✅ Measure melt temperature directly with IR gun

### If Problem Persists
- Install high-speed data logging (pressure, temp, RPM) - correlate with thickness
- Inspect screw for wear in compression section
- Check cooling uniformity (air ring balance or water flow)

### Investment Required
- Basic investigation: ~$2,000 in labor (2-3 days)
- Inline thickness gauge (if needed): $8,000-12,000
- Screw replacement (if worn): $15,000-25,000

### Key Insight from Pragmatist
Start with free/low-cost checks before investing in instrumentation. 40% of the time it's a material issue that costs nothing to verify.`;
  }

  if (lowerProblem.includes('plc') || lowerProblem.includes('microcontroller')) {
    return `## Synthesized Recommendation: PLC for Packaging Line Retrofit

### Decision: PLC (CompactLogix or S7-1200)

All specialists align on this recommendation:

| Criterion | PLC | Microcontroller | Winner |
|-----------|-----|-----------------|--------|
| 24-point I/O | Native support | Custom design | PLC |
| 16 hr operation | Industrial rated | Needs hardening | PLC |
| SCADA integration | EtherNet/IP native | Custom driver | PLC |
| 5-year maintenance | Standard skills | Specialized | PLC |
| Total cost | ~$16,000 | ~$30,000+ | PLC |

### Why Not Microcontroller?
The Pragmatist nailed it: **"The microcontroller is a false economy."**
- $3,000 hardware savings creates $14,000+ in extra engineering and risk
- Custom SCADA integration alone exceeds the PLC cost difference
- Plant technicians can't troubleshoot custom embedded code

### Recommended Solution
- **Controller**: Allen-Bradley CompactLogix L306ER ($3,500)
- **I/O**: Embedded 24-point I/O module
- **Communication**: EtherNet/IP to existing SCADA
- **Timeline**: 3-4 weeks including commissioning

### When to Revisit This Decision
Only consider microcontroller if:
- You're building 100+ identical units
- There's no existing SCADA to integrate with
- You have dedicated embedded engineers on staff`;
  }

  // Generic synthesis
  return `## Synthesized Analysis

### Problem Summary
The team has analyzed this challenge from multiple perspectives.

### Key Findings
${responses.map(r => `- **${AGENTS[r.agentId].name}**: Provided expertise on ${AGENTS[r.agentId].expertise.slice(0, 2).join(' and ')}`).join('\n')}

### Recommended Approach
Based on the combined specialist input:
1. Start with a clear definition of requirements and constraints
2. Consider the practical implementation factors raised by the Pragmatist
3. Follow the technical guidance from the domain specialists
4. Plan for integration with existing systems per the Systems Architect

### Next Steps
1. Review each specialist's detailed recommendations in the expandable panels above
2. Identify any conflicting advice and determine priority
3. Develop an implementation plan with clear milestones
4. Consider a phased approach to manage risk

*This synthesis represents the combined perspective of all consulted specialists.*`;
}

// Token counting (simulated)
export function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token
  return Math.ceil(text.length / 4);
}

export function calculateCost(tokens: number): number {
  // Claude pricing estimate: ~$0.015 per 1K input + output tokens
  return tokens * 0.000015;
}
