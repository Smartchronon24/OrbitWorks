---
title: "Jarvis Personal AI Assistant"
shortDescription: "A personal AI orchestration system for autonomous task execution, tool use, and agentic reasoning."
status: "Active"
dates: "2026"
featured: true
diagramImage: "/OrbitWorks/images/projects/jarvis-architecture.png"
order: 1
technologies: ["Python", "LLMs", "MCP", "Agentic AI", "Agentic Frameworks", "OpenClaw", "Oracle Cloud"]
archFlow:
  - "User Input (WhatsApp / CLI)"
  - "Planner — Intent & Routing"
  - "Tool Registry (MCP / JarvisMCP)"
  - "Worker Agents"
  - "LLM Inference (Ollama / Cloud)"
overview: >
  Jarvis is an ongoing personal research and build project exploring what a genuinely useful personal AI assistant looks like at the system architecture level. The goal is not a wrapper around a commercial API — it is an experiment in agentic design, tool orchestration, context management, and practical autonomy.
problem: >
  Most AI assistant interfaces are stateless, single-turn, and lack the ability to reason across tools, memory, and multi-step plans. Jarvis explores what it takes to build an assistant that can actually decompose goals, select appropriate tools, execute multi-step plans, and return coherent results — persistently.
whatWasBuilt: >
  A personal AI orchestration system composed of a planner/router, a tool registry built on the Model Context Protocol (MCP), worker agents, and a lightweight front-end accessible via WhatsApp. The system integrates with Ollama for local LLM inference and is partially deployed on Oracle Cloud.
architecture: >
  Input arrives from WhatsApp or CLI. The planner interprets intent and routes to the appropriate worker or tool chain. Tool access is mediated through JarvisMCP, an MCP-based tool registry. Workers execute tasks and return results to the planner, which synthesises a response.
implementationDetails: >
  The tool registry is built on the Model Context Protocol (MCP), allowing tools to be registered, discovered, and called through a consistent interface. JarvisMCP is a custom MCP server implementation that wraps various tool capabilities. OpenClaw is an experimental integration for broader capability extension. Local LLM inference runs via Ollama; model selection and context caching are active research areas.
decisions: >
  MCP was chosen as the tool interface standard because it provides a structured, model-agnostic protocol for tool registration and invocation — removing tight coupling between the planner and individual tool implementations. This makes adding or swapping tools possible without rewriting orchestration logic.
tradeoffs: >
  Running inference locally via Ollama keeps data private and eliminates API costs, but introduces latency and resource constraints compared to hosted models. Context caching and prompt engineering are being explored to reduce per-turn inference costs.
futureWork: >
  Active exploration areas: memory/context persistence across sessions, more sophisticated multi-step planning, broader tool coverage, improved WhatsApp integration, and deeper Oracle Cloud deployment. Some of these are experimental; none are complete production features.
---

## Status Note

Jarvis is an active, evolving personal research project. The architecture described here reflects the current state and direction of exploration, not a finished commercial product. What is listed under Future Work represents planned investigation, not completed features.

## Model Experimentation

A significant portion of Jarvis development involves empirical model evaluation — testing different open-weight and proprietary models across reasoning, tool selection, and response quality benchmarks relevant to personal assistant use cases. Results are ongoing.