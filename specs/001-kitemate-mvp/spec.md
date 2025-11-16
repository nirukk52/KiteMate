# Feature Specification: KiteMate - Personal Finance Companion for Zerodha Users

**Feature Branch**: `001-kitemate-mvp`
**Created**: 2025-11-15
**Status**: Draft
**Input**: User description: "KiteMate — A personal finance companion for Zerodha users that enables account connection, natural language portfolio queries, automatic dashboard generation, and social sharing/forking of widgets on public profiles."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Connect Zerodha Account and View Portfolio (Priority: P1)

A new user arrives at KiteMate, connects their Zerodha account via secure authorization, and immediately sees their current portfolio overview including holdings, P&L, and recent activity. This is the foundation that enables all other features.

**Why this priority**: Without account connection and data access, no other functionality is possible. This is the core value proposition and must work reliably for the product to exist.

**Independent Test**: Can be fully tested by completing the Zerodha OAuth flow and verifying that portfolio data displays correctly. Delivers immediate value by consolidating portfolio information in one place.

**Acceptance Scenarios**:

1. **Given** a user with a Zerodha account, **When** they click "Connect Zerodha Account", **Then** they are redirected to Zerodha's authorization page
2. **Given** user has authorized KiteMate, **When** they return from Zerodha OAuth, **Then** their portfolio data is fetched and displayed within 5 seconds
3. **Given** user's portfolio is connected, **When** they view their dashboard, **Then** they see current holdings, total P&L, and recent trades
4. **Given** user has no holdings, **When** portfolio loads, **Then** they see a friendly message encouraging them to start investing with helpful guidance
5. **Given** Zerodha authorization fails, **When** error occurs, **Then** user sees clear error message with retry option

---

### User Story 2 - Chat with Portfolio Using Natural Language (Priority: P2)

An investor wants quick insights without navigating complex menus. They type plain questions like "What's my P&L this month?" or "Show my top performing stocks" and instantly receive clear answers with visual widgets (charts, tables, cards).

**Why this priority**: This is the core differentiator that makes KiteMate unique. Natural language interaction removes friction and makes portfolio analysis accessible to beginners while being fast for enthusiasts.

**Independent Test**: Can be fully tested by submitting various natural language queries and verifying that appropriate widgets are generated with accurate data. Delivers value by making data analysis effortless.

**Acceptance Scenarios**:

1. **Given** connected portfolio, **When** user asks "What's my P&L this month?", **Then** system displays a chart showing monthly P&L trend plus a summary card
2. **Given** connected portfolio, **When** user asks "Show allocation by sector", **Then** system generates a pie chart of sector-wise holdings with percentage breakdown
3. **Given** connected portfolio, **When** user asks "What are my top movers today?", **Then** system shows a table of stocks sorted by daily percentage change
4. **Given** user asks unclear question, **When** system cannot interpret intent, **Then** system asks clarifying question or suggests similar queries
5. **Given** portfolio has no data for query, **When** user asks time-specific question, **Then** system explains why data is unavailable and suggests alternatives

---

### User Story 3 - Generate and Customize Dashboard Widgets (Priority: P3)

A user wants to create a personalized dashboard showing the metrics they care about most. They generate widgets through chat or manual creation, arrange them on their private dashboard, and customize display preferences for quick daily check-ins.

**Why this priority**: Personalized dashboards provide ongoing value and encourage daily engagement. This builds on P1 (data access) and P2 (insight generation) to create a persistent, tailored experience.

**Independent Test**: Can be fully tested by creating widgets, arranging them on a dashboard, and verifying they persist across sessions. Delivers value through personalized at-a-glance insights.

**Acceptance Scenarios**:

1. **Given** user receives widget from chat query, **When** they click "Add to Dashboard", **Then** widget is saved to their private dashboard
2. **Given** user is viewing dashboard, **When** they drag and drop widgets, **Then** layout is saved and persists on next visit
3. **Given** user wants to track specific metrics, **When** they create a custom widget (e.g., "Track my SIP investments"), **Then** widget appears on dashboard and updates daily
4. **Given** user has multiple widgets, **When** they remove or hide a widget, **Then** it is removed from view but can be restored from saved widgets
5. **Given** dashboard has widgets, **When** user triggers refresh, **Then** all widgets update with latest portfolio data

---

### User Story 4 - Share Widgets on Public Profile (Priority: P4)

An engaged user has created impressive widgets showing their portfolio performance or analysis approach. They want to share selected widgets on their public KiteMate profile where others can view, appreciate, and learn from their insights. This builds community and showcases expertise.

**Why this priority**: Social sharing creates viral growth opportunities and builds community engagement. This is valuable for growth but not essential for core individual use.

**Independent Test**: Can be fully tested by making widgets public, viewing them on public profile URL, and verifying privacy controls work. Delivers value through social recognition and knowledge sharing.

**Acceptance Scenarios**:

1. **Given** user has private widgets, **When** they toggle "Make Public" on a widget, **Then** widget appears on their public profile URL
2. **Given** widget is public, **When** another user visits the profile, **Then** they can view the widget and its current data snapshot
3. **Given** user has public profile, **When** someone views it, **Then** they see curated widgets, profile description, and follower count
4. **Given** user wants privacy, **When** they toggle widget back to private, **Then** widget is immediately removed from public view
5. **Given** user shares public profile link, **When** recipients open link, **Then** they see profile without needing to log in

---

### User Story 5 - Discover and Fork Widgets from Community (Priority: P5)

A beginner user wants to learn from experienced investors. They browse the KiteMate community, discover useful widgets (like "Monthly SIP Tracker" or "Sector Allocation Pie"), and fork them to their own dashboard with one click. This accelerates onboarding and spreads best practices.

**Why this priority**: Social discovery and forking reduce the learning curve and provide instant value to new users. This creates network effects but requires P1-P4 to be functional first.

**Independent Test**: Can be fully tested by discovering public widgets, forking them, and verifying they work on user's own portfolio data. Delivers value through instant access to proven widget templates.

**Acceptance Scenarios**:

1. **Given** user browses community, **When** they find a useful widget on another profile, **Then** they can click "Fork to My Dashboard"
2. **Given** user forks a widget, **When** fork completes, **Then** widget appears on their dashboard populated with their own portfolio data
3. **Given** widget creator, **When** someone forks their widget, **Then** they receive notification of the fork and follower count increases
4. **Given** user wants to see popular widgets, **When** they visit discovery page, **Then** they see trending widgets sorted by fork count
5. **Given** user forks many widgets, **When** they review their dashboard, **Then** forked widgets are marked as community templates with attribution to original creator

---

### User Story 6 - CSV Import for Quick Start (Priority: P6)

A user who tracks investments outside Zerodha or wants historical data wants to import their portfolio via CSV. They upload a properly formatted file and KiteMate processes it to populate their portfolio, enabling immediate use of all chat and widget features even before connecting Zerodha.

**Why this priority**: CSV import lowers barriers for users who need manual data entry or historical backfill. While useful for adoption, it's not core to the Zerodha-native experience.

**Independent Test**: Can be fully tested by uploading sample CSV files and verifying data appears correctly in portfolio. Delivers value through flexibility and historical data access.

**Acceptance Scenarios**:

1. **Given** user without Zerodha connection, **When** they upload CSV with holdings, **Then** portfolio is populated and available for queries
2. **Given** CSV format is incorrect, **When** user uploads file, **Then** system shows clear error messages indicating which fields are missing or malformed
3. **Given** user has both CSV and Zerodha data, **When** they import CSV, **Then** system asks whether to merge or replace existing data
4. **Given** user uploads historical data, **When** data is processed, **Then** time-based queries reflect imported history
5. **Given** CSV import succeeds, **When** user asks questions about imported data, **Then** chat handles CSV data identically to Zerodha data

---

### User Story 7 - Upgrade to Pro for Unlimited Chat Queries (Priority: P7)

A power user who relies heavily on portfolio insights hits the monthly chat query limit on the free tier. They upgrade to the Pro plan for unlimited natural language queries and access to advanced query types (multi-period comparisons, complex filters, predictive insights).

**Why this priority**: Monetization is important but not required for initial traction. Free tier must prove value before users will pay. Chat is the core differentiator, making it the natural monetization lever.

**Independent Test**: Can be fully tested by reaching free tier query limits, upgrading account, and verifying unlimited queries are enabled. Delivers value through unrestricted access to insights.

**Acceptance Scenarios**:

1. **Given** free user approaches monthly query limit, **When** they have 5 queries remaining, **Then** they see notification about approaching limit with upgrade option
2. **Given** free user hits monthly query limit, **When** they try to ask another question, **Then** they see upgrade prompt explaining Pro benefits and showing reset date
3. **Given** user upgrades to Pro, **When** payment completes, **Then** unlimited chat queries are enabled immediately with reset to zero usage count
4. **Given** Pro user, **When** they use chat feature, **Then** no query limits apply and advanced query types are available
5. **Given** user wants to compare plans, **When** they view pricing page, **Then** clear comparison shows free tier monthly limit vs Pro unlimited queries and advanced features

---

### Edge Cases

- **What happens when Zerodha account authorization is revoked?** System detects disconnection on next data fetch and prompts user to reconnect. Existing widgets show cached data with staleness indicator.

- **What happens when portfolio data is empty or zero holdings?** System displays encouraging empty state message suggesting user start investing or import CSV data for analysis practice.

- **How does system handle ambiguous natural language queries?** System uses clarifying questions (e.g., "Did you mean P&L for realized trades or unrealized holdings?") or suggests similar queries users have asked.

- **What happens when two users fork the same widget simultaneously?** Each fork is independent; both users get their own copy populated with their respective portfolio data. No conflicts occur.

- **How does system handle extremely large portfolios (500+ holdings)?** Widgets are optimized for top-N display (e.g., top 20 holdings by value) with option to view full data. Performance remains responsive.

- **What happens when user asks for data beyond available history?** System explains data availability limits and shows what's available (e.g., "Zerodha provides 6 months of history; here's your P&L from June onward").

- **How does system handle concurrent edits to dashboard layout?** If user has dashboard open in multiple tabs, last save wins with timestamp. No real-time collaborative editing in V1.

- **What happens when widget creator deletes a widget that others have forked?** Forked copies remain intact and functional; they are independent instances. Only original creator's profile removes the widget.

- **How does system handle failed payment for Pro subscription?** User receives email notification and 7-day grace period. If payment not resolved, account reverts to free tier with monthly chat query limits enforced from next billing cycle.

- **What happens during Zerodha API downtime or rate limiting?** System shows friendly error message, uses cached data if available, and suggests retry timing. Critical: no user data is lost.

## Requirements *(mandatory)*

### Functional Requirements

#### Account & Authentication

- **FR-001**: System MUST allow users to connect their Zerodha account via OAuth authorization flow
- **FR-002**: System MUST securely store Zerodha API access tokens with encryption at rest
- **FR-003**: System MUST fetch portfolio data (holdings, positions, orders, P&L) from Zerodha API upon successful authorization
- **FR-004**: System MUST handle OAuth token expiration and prompt users to re-authorize when needed
- **FR-005**: Users MUST be able to disconnect their Zerodha account at any time, revoking KiteMate's API access

#### Natural Language Chat & Insights

- **FR-006**: System MUST accept natural language text queries about portfolio data
- **FR-007**: System MUST interpret common financial queries (P&L, allocation, top movers, SIP tracking, performance)
- **FR-008**: System MUST generate appropriate visualizations (charts, tables, cards) based on query intent
- **FR-009**: System MUST display query results within 3 seconds for standard portfolio sizes (under 100 holdings)
- **FR-010**: System MUST handle ambiguous queries by asking clarifying questions or suggesting alternatives
- **FR-011**: System MUST show data source and timestamp for all generated insights

#### Widget Generation & Management

- **FR-012**: System MUST allow users to save chat-generated widgets to their personal dashboard
- **FR-013**: System MUST support manual widget creation through predefined templates (charts, tables, cards, tiles)
- **FR-014**: Users MUST be able to customize widget display settings (time range, grouping, colors)
- **FR-015**: Users MUST be able to arrange dashboard layout via drag-and-drop reordering
- **FR-016**: System MUST persist dashboard layout and widget configurations across sessions
- **FR-017**: System MUST allow users to delete or hide widgets from their dashboard
- **FR-018**: System MUST refresh widget data daily at a scheduled time
- **FR-019**: Users MUST be able to manually trigger widget refresh on demand

#### Privacy & Sharing

- **FR-020**: System MUST distinguish between private widgets (personal use) and public widgets (shared on profile)
- **FR-021**: Users MUST be able to toggle any widget between private and public visibility
- **FR-022**: System MUST generate a unique public profile URL for each user
- **FR-023**: Public profiles MUST display only public widgets, user name, bio, and social stats (followers, forks received)
- **FR-024**: Public profiles MUST be viewable by anyone without requiring login
- **FR-025**: All users MUST be able to create unlimited private and public widgets regardless of subscription tier

#### Social Discovery & Forking

- **FR-027**: System MUST allow users to browse community-shared widgets via discovery page
- **FR-028**: Users MUST be able to fork public widgets from other users' profiles with one click
- **FR-029**: Forked widgets MUST populate with the forking user's own portfolio data, not the original creator's data
- **FR-030**: System MUST notify widget creators when their widgets are forked
- **FR-031**: System MUST track fork counts and display trending widgets on discovery page
- **FR-032**: Forked widgets MUST include attribution to the original creator

#### CSV Import & Data Flexibility

- **FR-033**: System MUST allow users to upload portfolio data via CSV file format
- **FR-034**: System MUST validate CSV structure and provide clear error messages for malformed files
- **FR-035**: System MUST support CSV fields: symbol, quantity, average price, purchase date, asset type
- **FR-036**: Users MUST be able to choose whether CSV import merges with or replaces existing portfolio data
- **FR-037**: System MUST treat CSV-imported data identically to Zerodha API data for all chat and widget features

#### Notifications & Engagement

- **FR-038**: System MUST notify users when someone forks their public widget
- **FR-039**: System MUST notify users when someone follows their public profile
- **FR-040**: System MUST notify users of daily data refresh completion
- **FR-041**: Users MUST be able to configure notification preferences (email, in-app, push)

#### Subscription & Monetization

- **FR-042**: System MUST support free tier with monthly chat query limit (e.g., 50 queries per month) and basic query types
- **FR-043**: System MUST support Pro tier subscription with unlimited chat queries and access to advanced query features
- **FR-044**: System MUST track chat query usage count per user and reset monthly for free tier users
- **FR-045**: System MUST notify free tier users when approaching query limit (e.g., at 80%, 90%, 100%)
- **FR-046**: System MUST block additional chat queries when free tier users exceed monthly limit until next reset
- **FR-047**: Pro tier MUST include advanced query capabilities (multi-period comparisons, complex filters, predictive insights)
- **FR-048**: System MUST handle payment processing securely for Pro subscriptions
- **FR-049**: Users MUST be able to upgrade, downgrade, or cancel subscription at any time
- **FR-050**: System MUST immediately grant unlimited query access upon Pro subscription activation

### Key Entities

- **User**: Represents a KiteMate account holder. Key attributes: unique ID, name, email, Zerodha connection status, subscription tier (free/pro), public profile URL, bio, follower count, joined date, monthly chat query count, query limit reset date.

- **Portfolio**: Represents a user's investment holdings. Key attributes: user ID (owner), data source (Zerodha API or CSV import), last sync timestamp, total value, total P&L, currency. Contains collections of holdings, positions, and transactions.

- **Holding**: Represents a stock or asset owned. Key attributes: symbol/ticker, quantity, average purchase price, current market price, unrealized P&L, asset type (equity, mutual fund, etc.), sector classification.

- **Transaction**: Represents a buy/sell order or trade. Key attributes: symbol, transaction type (buy/sell), quantity, price, transaction date, order ID from Zerodha, fees/charges.

- **Widget**: Represents a visual component displaying portfolio insights. Key attributes: unique ID, owner user ID, widget type (chart/table/card/tile), configuration (query, filters, time range), visibility (private/public), creation date, fork count if public. Relationships: belongs to one user, may be forked from another widget.

- **Dashboard**: Represents a user's personalized layout. Key attributes: user ID (owner), layout configuration (widget positions and sizes), last modified timestamp. Relationships: contains multiple widgets.

- **Public Profile**: Represents a user's shareable page. Key attributes: user ID (owner), display name, bio, profile picture, follower count, total fork count received. Relationships: displays subset of user's widgets (public only).

- **Fork**: Represents a copy relationship between widgets. Key attributes: original widget ID, forked widget ID, forking user ID, fork date. Tracks widget genealogy and attribution.

- **Notification**: Represents an event requiring user attention. Key attributes: recipient user ID, notification type (fork, follow, data refresh, system alert), message content, read status, timestamp.

- **Subscription**: Represents a user's payment plan. Key attributes: user ID, tier (free/pro), payment status, billing cycle, subscription start date, renewal date, payment method reference, monthly query limit (null for Pro/unlimited), advanced features enabled flag.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can complete Zerodha account connection and view their portfolio within 2 minutes of first visit
- **SC-002**: Natural language queries return accurate visualizations within 3 seconds for 95% of standard portfolio sizes
- **SC-003**: Users can create and save a personalized dashboard with at least 3 widgets within 5 minutes of connecting portfolio
- **SC-004**: 80% of first-time users successfully generate at least one widget through natural language chat on their initial session
- **SC-005**: Public widget sharing completes in one click with confirmation visible within 2 seconds
- **SC-006**: Forked widgets populate with user's own data and appear on dashboard within 5 seconds
- **SC-007**: CSV import processes files with up to 500 holdings within 10 seconds and provides validation feedback
- **SC-008**: Daily data refresh completes for 99% of users within their scheduled refresh window
- **SC-009**: System supports at least 1,000 concurrent users without performance degradation
- **SC-010**: 70% of users who view another user's public profile fork at least one widget within their session
- **SC-011**: Free-to-Pro conversion rate reaches at least 5% among users who hit monthly chat query limits
- **SC-012**: User satisfaction score of at least 4.0/5.0 for natural language query accuracy and usefulness
- **SC-013**: Public profiles receive an average of 10+ views per month for active sharers (users with 5+ public widgets)
- **SC-014**: System uptime of 99.5% excluding scheduled maintenance windows
- **SC-015**: Zero security incidents related to unauthorized access to user portfolio data or Zerodha tokens

## Dependencies & Assumptions

### External Dependencies

- **Zerodha Kite Connect API**: KiteMate relies on Zerodha's Kite Connect API for portfolio data access (holdings, positions, orders, P&L). Assumes API availability, stability, and continued support.

- **OAuth Authorization**: Assumes Zerodha supports OAuth 2.0 flow for third-party application authorization, enabling secure account connection without storing user credentials.

- **Payment Gateway**: Pro subscription requires integration with a payment processing service (specifics to be determined during implementation). Assumes availability of secure payment handling.

### User Assumptions

- **Target User Profile**: Users have active Zerodha trading/demat accounts with portfolio data to analyze.

- **Technical Literacy**: Users can navigate web applications, understand basic financial terminology (P&L, holdings, SIP), and complete OAuth authorization flows.

- **Device Access**: Users access KiteMate via modern web browsers on desktop or mobile devices with internet connectivity.

### Data Assumptions

- **Portfolio Data Format**: Zerodha API provides standardized data formats for holdings, transactions, and market prices. Assumes consistency in data structure.

- **Historical Data Availability**: Assumes Zerodha provides historical portfolio data (at minimum 6 months) for time-based analysis and queries.

- **Market Data Refresh**: Assumes Zerodha API provides reasonably current market prices (real-time or delayed by standard market data intervals).

- **CSV Data Quality**: For CSV imports, assumes users can provide data in standard tabular format with essential fields (symbol, quantity, price, date).

### Business Assumptions

- **Freemium Model Viability**: Assumes sufficient conversion from free to Pro tier to sustain business model. Free tier monthly chat query limits designed to demonstrate value while creating upgrade incentive for power users.

- **Query Limit Effectiveness**: Assumes monthly query limit (e.g., 50 queries) is sufficient for casual users to experience value while motivating frequent users to upgrade.

- **Community Engagement**: Assumes users will engage with social features (public profiles, widget sharing, forking) to create network effects and viral growth.

- **Widget Value Proposition**: Assumes auto-generated visualizations provide sufficient value to drive engagement and reduce need for spreadsheet-based portfolio tracking.

### Technical Assumptions

- **Natural Language Processing**: Assumes availability of NLP capabilities (via libraries or services) to interpret financial queries with reasonable accuracy (target: 80%+ intent recognition for common queries).

- **Data Security**: Assumes standard encryption practices (HTTPS, encrypted storage) are sufficient for protecting user portfolio data and API tokens. Compliance with data protection regulations required.

- **Scalability**: Initial V1 targets 1,000 concurrent users; assumes infrastructure can scale horizontally as user base grows beyond this threshold.

### Known Constraints

- **Zerodha Exclusivity (V1)**: V1 supports only Zerodha accounts. Multi-broker support is out of scope for initial release.

- **Data Refresh Frequency**: V1 implements daily scheduled refresh. Real-time portfolio updates are out of scope for initial release.

- **Mobile Apps**: V1 is web-based. Native mobile applications are out of scope for initial release.

- **Advanced Analytics**: Complex portfolio analytics (backtesting, risk modeling, tax optimization) are out of scope for V1. Focus is on accessible insights for retail investors.

- **Regulatory Compliance**: Assumes KiteMate operates as a portfolio visualization tool, not a financial advisor or broker. No investment recommendations or trading functionality in V1.
