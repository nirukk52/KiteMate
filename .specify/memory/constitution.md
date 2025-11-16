<!--
Sync Impact Report:
- Version change: 1.0.0 → 1.0.1
- Modified Principle V (Comprehensive Testing): Clarified test coverage targets and testing philosophy
- Modified Code Quality Standards: Adjusted coverage requirements to 50-60% range
- Added guidance: Focus on observational behavior, avoid petty implementation tests
- Templates status: ✅ All dependent templates aligned
- Created: 2025-11-15
- Last amended: 2025-11-15
-->

# KiteMate Constitution

## Core Principles

### I. Test-Driven Development (NON-NEGOTIABLE)

**All features MUST follow the RED-GREEN-REFACTOR cycle:**
- Tests written first and approved by stakeholders
- Tests MUST fail initially (RED phase)
- Implementation proceeds only after test approval (GREEN phase)
- Code optimization and cleanup follows (REFACTOR phase)

**Rationale**: TDD ensures specifications are testable, prevents scope creep, and creates living documentation of expected behavior.

### II. Single Normalized Portfolio Schema

**Portfolio data MUST adhere to a single, normalized schema:**
- One canonical data model for portfolio representation
- Schema versioning is mandatory for all changes
- No denormalized or duplicate portfolio state across the system
- All portfolio mutations go through schema validation

**Rationale**: A single source of truth prevents data inconsistencies, simplifies debugging, and enables reliable portfolio operations across all connectors.

### III. Connector-Agnostic Architecture

**The system MUST remain independent of specific brokerage implementations:**
- Business logic operates on the normalized schema, never directly on connector data
- Connectors are adapters that translate between broker APIs and the canonical schema
- New connectors can be added without modifying core business logic
- Connector failures are isolated and do not compromise the core system

**Rationale**: Connector independence enables multi-broker support, reduces vendor lock-in, and simplifies testing with mock connectors.

### IV. NL → DSL → Data Pipeline (MANDATORY)

**Natural Language inputs MUST be transformed through a validated DSL before database operations:**
- Natural Language (user intent) → Domain Specific Language (validated commands)
- DSL → Database operations (never NL → DB directly)
- The DSL layer is:
  - **Validated**: Syntax and semantic checking before execution
  - **Logged**: Every DSL command is persisted with timestamp and context
  - **Versioned**: DSL evolution is tracked and backward-compatible
  - **Replayable**: Historical operations can be reconstructed from DSL logs
  - **Exposable**: Third-party developers can safely use the DSL API

**Rationale**: The DSL layer provides safety, auditability, and extensibility. Direct NL→DB is unverifiable and creates technical debt.

### V. Comprehensive Testing (NON-NEGOTIABLE)

**Three levels of testing are mandatory:**
- **Unit Tests**: Test observational behavior, not implementation details
  - Focus on public interfaces and observable outcomes
  - Avoid petty tests that simply mirror implementation
  - Test invariants, edge cases, and business logic
- **Integration Tests**: Required for:
  - Connector implementations and portfolio schema translations
  - DSL parsing, validation, and execution
  - Database operations and schema migrations
  - Authentication and authorization flows
- **End-to-End Tests**: Critical user journeys must be covered:
  - Portfolio sync from external broker
  - Natural language command processing through DSL to execution
  - Multi-connector portfolio aggregation

**Testing Philosophy**:
- Write tests that provide value, not just coverage
- Prioritize tests for critical paths and invariants
- Avoid over-testing implementation details that may change
- Tests should document expected behavior, not implementation

**Rationale**: Meaningful testing at all levels ensures system reliability, especially critical for financial data handling. Over-testing creates maintenance burden without proportional value.

### VI. Runtime Invariants & Observability

**Every specification MUST define runtime invariants and monitoring:**
- From each spec, derive a set of "this should never happen" conditions
- Invariants MUST be:
  - **Logged**: Violations are captured with full context
  - **Monitored**: Alerts configured for invariant violations
  - **Actionable**: Clear remediation steps documented
- Examples of invariants:
  - Portfolio value should never be negative
  - DSL commands must always pass validation before execution
  - Connector responses must conform to schema before persistence

**Rationale**: Explicit invariants catch bugs in production, provide early warning signals, and document system assumptions.

### VII. Simplicity & YAGNI Principles

**Start simple, add complexity only when justified:**
- Features must solve actual user problems, not hypothetical future needs
- Premature optimization and over-engineering are prohibited
- Complexity must be explicitly justified in specifications
- Favor readable code over clever code

**Rationale**: Simplicity reduces maintenance burden, accelerates development, and minimizes bugs.

## Development Workflow

**Hybrid Spec-Driven Approach:**

- **Major Features**: Require full specification, approval, and planning before implementation
  - Use `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement` workflow
  - Stakeholder approval required before moving from spec to implementation

- **Minor Changes**: Can proceed with issue tracking and direct implementation
  - Bug fixes, minor UI tweaks, documentation updates
  - Still require tests and code review

- **Breaking Changes**: Always require specification and migration plan
  - Schema changes, API modifications, DSL updates
  - Backward compatibility analysis mandatory

## Code Quality Standards

**All code submissions MUST meet:**
- **Test Coverage**:
  - Minimum 50% line coverage for new code
  - Never target more than 60% coverage
  - Focus on meaningful tests, not coverage percentage
  - Quality over quantity: test observational behavior, not implementation
- **Code Review**: At least one approval from a project maintainer
- **Documentation**: Public APIs and DSL commands must be documented
- **Linting**: Code must pass all configured linters and formatters
- **Security**: No hardcoded secrets, proper input validation, secure data handling

## Governance

**Constitution Authority:**
- This constitution supersedes all other development practices
- All pull requests MUST be verified for constitutional compliance
- Reviewers have the authority to reject non-compliant code

**Amendment Process:**
- Constitution changes require documentation of rationale
- Major changes (breaking principles) require team consensus
- All amendments must include version bump and migration guidance
- Use `/speckit.constitution` to propose and document amendments

**Version Management:**
- **MAJOR**: Principle removal, redefinition, or breaking governance changes
- **MINOR**: New principles added or existing principles materially expanded
- **PATCH**: Clarifications, wording improvements, typo fixes

**Compliance Verification:**
- All PRs must reference applicable constitutional principles
- CI/CD pipeline should automate compliance checks where possible
- Quarterly constitution review to ensure principles remain relevant

---

**Version**: 1.0.1 | **Ratified**: 2025-11-15 | **Last Amended**: 2025-11-15
