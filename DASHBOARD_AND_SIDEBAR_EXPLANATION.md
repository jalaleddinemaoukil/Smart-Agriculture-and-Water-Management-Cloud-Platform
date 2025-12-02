# Dashboard & Sidebar Component Explanation

This document provides a detailed explanation of the Dashboard page content and the Sidebar navigation component in the SWAMP application.

---

## 📊 DASHBOARD CONTENT

### Overview
The Dashboard (`src/pages/Dashboard.tsx`) is the main landing page that displays real-time sensor data, metrics, charts, and alerts for agricultural monitoring. It provides a comprehensive overview of farm conditions at a glance.

---

### 1. **Header Section**

**Location:** Top of the page, fixed height (64px)

**Components:**
- **Sidebar Toggle Button** - Hamburger menu icon to show/hide sidebar
- **Breadcrumb Navigation** - Shows current page ("Dashboard") and last update time
- **Refresh Button** - Manual refresh button with spinning icon when loading

**Features:**
- Displays "Updated [time]" showing when data was last fetched
- Refresh button is disabled during loading (shows spinning icon)
- Responsive: breadcrumb items hidden on mobile (`hidden md:block`)

**Code Location:** Lines 108-143

---

### 2. **Alert System**

**Error Alert** (Lines 148-154)
- **Trigger:** Displays when `error` state is not null
- **Style:** Destructive variant (red/danger styling)
- **Content:** Shows error message from API or data fetching failures
- **Icon:** AlertTriangle icon

**Critical Alert** (Lines 157-165)
- **Trigger:** Displays when any alert with `type: 'critical'` exists
- **Style:** Destructive variant (red/danger styling)
- **Content:** Shows the first critical alert message
- **Purpose:** Highlights urgent issues requiring immediate attention
- **Icon:** AlertTriangle icon

---

### 3. **Metric Cards Grid** (4 Cards)

**Layout:** Responsive grid
- Mobile: 1 column
- Tablet (`md:`): 2 columns
- Desktop (`lg:`): 4 columns

**Cards Display:**

#### a) **Soil Moisture Card**
- **Value:** Latest reading's `soilMoisture` (percentage)
- **Unit:** `%`
- **Icon:** Droplets icon (💧)
- **Trend:** Calculated vs previous reading
  - Shows percentage change
  - Direction: up/down/stable
  - Color-coded (green for up, red for down, gray for stable)

#### b) **Temperature Card**
- **Value:** Latest reading's `temperature` (celsius)
- **Unit:** `°C`
- **Icon:** Thermometer icon (🌡️)
- **Trend:** Calculated vs previous reading
  - Shows percentage change
  - Direction: up/down/stable

#### c) **Humidity Card**
- **Value:** Latest reading's `humidity` (percentage)
- **Unit:** `%`
- **Icon:** Wind icon (💨)
- **Trend:** Calculated vs previous reading
  - Shows percentage change
  - Direction: up/down/stable

#### d) **Water Used Today Card**
- **Value:** Latest reading's `waterUsed` (liters)
- **Unit:** `L`
- **Icon:** TrendingUp icon (📈)
- **Note:** No trend indicator (cumulative metric)

**Loading State:**
- Shows 4 skeleton cards while loading
- Skeleton shows placeholder rectangles for title and value

**Code Location:** Lines 168-214

---

### 4. **Charts Section** (2 Charts)

**Layout:** Responsive grid (2 columns on desktop, stacked on mobile)

#### a) **Soil Moisture Chart (24h)**
- **Type:** Line chart (Recharts)
- **Data:** Last 24 readings (hourly data points)
- **X-Axis:** Time (formatted as HH:MM)
- **Y-Axis:** Soil moisture percentage
- **Line Color:** Chart theme color (`hsl(var(--chart-1))`)
- **Features:**
  - Grid lines (dashed)
  - Tooltip on hover
  - Responsive container
  - Smooth curve (monotone interpolation)

#### b) **Temperature Chart (24h)**
- **Type:** Line chart (Recharts)
- **Data:** Last 24 readings (hourly data points)
- **X-Axis:** Time (formatted as HH:MM)
- **Y-Axis:** Temperature in Celsius
- **Line Color:** Destructive theme color (red/orange)
- **Features:**
  - Grid lines (dashed)
  - Tooltip on hover
  - Responsive container
  - Smooth curve (monotone interpolation)

**Data Processing:**
- Takes first 24 readings from store
- Reverses array (oldest to newest)
- Maps to chart format: `{ time, moisture, temperature }`
- Formats timestamps to readable time format

**Loading State:**
- Shows skeleton placeholder (250px height) while loading

**Code Location:** Lines 217-299

---

### 5. **Recent Readings Table**

**Layout:** Single card spanning full width

**Content:**
- **Title:** "Recent Readings"
- **Data:** Last 5 sensor readings
- **Display Format:**
  - Left: Timestamp (formatted as locale date/time string)
  - Right: Key metrics
    - 💧 Soil moisture percentage (1 decimal)
    - 🌡️ Temperature in Celsius (1 decimal)

**Features:**
- Border separator between items
- Empty state message when no readings available
- Loading skeleton (5 placeholder rows) while fetching

**Code Location:** Lines 302-339

---

### 6. **Data Management & State**

**State Management:** Uses Zustand store (`useSensorStore`)

**State Properties:**
- `latestReading` - Most recent sensor reading
- `readings` - Array of all sensor readings
- `alerts` - Array of active alerts
- `isLoading` - Loading state boolean
- `error` - Error message string (null if no error)
- `lastUpdated` - ISO timestamp of last successful fetch

**Methods Used:**
- `startPolling(30000)` - Starts auto-refresh every 30 seconds
- `stopPolling()` - Stops auto-refresh (cleanup on unmount)
- `fetchData()` - Manual refresh function

**Auto-Refresh:**
- Starts polling on component mount
- Polls every 30 seconds (30000ms)
- Stops polling when component unmounts
- Uses React `useEffect` hook for lifecycle management

**Code Location:** Lines 41-57

---

### 7. **Trend Calculation Logic**

**Function:** `calculateTrend(current, previous)` (Lines 77-88)

**Logic:**
1. If no previous value exists → returns `{ direction: 'stable', value: 0 }`
2. Calculates percentage change: `((current - previous) / previous) * 100`
3. If change < 1% → returns stable (ignores tiny fluctuations)
4. Otherwise:
   - Positive change → `direction: 'up'`
   - Negative change → `direction: 'down'`
   - Value is absolute percentage change

**Applied To:**
- Soil Moisture trend
- Temperature trend
- Humidity trend

**Code Location:** Lines 76-101

---

### 8. **Component Dependencies**

**UI Components Used:**
- `AppSidebar` - Sidebar navigation component
- `SidebarProvider`, `SidebarInset`, `SidebarTrigger` - Sidebar layout
- `MetricCard` - Custom metric display card
- `Card`, `CardHeader`, `CardTitle`, `CardContent` - Card containers
- `Alert`, `AlertTitle`, `AlertDescription` - Alert messages
- `Skeleton` - Loading placeholders
- `Button` - Refresh button
- `Breadcrumb` components - Navigation breadcrumbs
- `Separator` - Visual divider

**Charts:**
- `LineChart`, `Line`, `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `ResponsiveContainer` from Recharts

**Icons:**
- `Droplets`, `Thermometer`, `Wind`, `TrendingUp`, `AlertTriangle`, `RefreshCw` from Lucide React

---

### 9. **Responsive Design**

**Breakpoints:**
- Mobile: Single column layout
- Tablet (`md:`): 2-column metric cards, 2-column charts
- Desktop (`lg:`): 4-column metric cards, 2-column charts

**Adaptive Elements:**
- Breadcrumb items hidden on mobile
- Grid layouts adjust based on screen size
- Charts maintain aspect ratio across devices

---

### 10. **Error Handling**

**Scenarios Handled:**
1. **API Errors:** Shows error alert with message
2. **Empty Data:** Shows "No readings available" message
3. **Loading States:** Skeleton placeholders prevent layout shift
4. **Invalid Data:** Array checks prevent runtime errors (`Array.isArray()`)

**Safety Checks:**
- Checks if `readings` is array before mapping
- Null checks for `latestReading` (uses `?.` optional chaining)
- Fallback values (0) when data unavailable

---

## 🎯 SIDEBAR COMPONENT

### Overview
The Sidebar (`src/components/app-sidebar.tsx`) provides navigation and user account access. It's a collapsible sidebar that can shrink to icon-only mode.

---

### 1. **Sidebar Structure**

**Component:** `AppSidebar`
**Type:** Collapsible sidebar (can toggle between full and icon-only mode)
**Framework:** Shadcn UI Sidebar component

**Sections:**
1. **Header** - Logo/Branding
2. **Content** - Main navigation menu
3. **Footer** - User account section
4. **Rail** - Visual indicator for collapsed state

**Code Location:** `src/components/app-sidebar.tsx` (Lines 103-141)

---

### 2. **Header Section**

**Content:**
- **Logo Image:** `/swamp-logo.svg`
- **Size:** Full width, height 56px (`h-14`)
- **Style:** Rounded corners, object-contain to maintain aspect ratio
- **Behavior:** Clickable link (currently links to `#`)

**Code Location:** Lines 107-126

---

### 3. **Navigation Menu** (`NavMain` Component)

**Component:** `src/components/nav-main.tsx`

**Menu Items:**

#### a) **Dashboard**
- **Route:** `/dashboard`
- **Icon:** `LayoutDashboard` (dashboard grid icon)
- **Status:** Active (current page indicator)
- **Badge:** None

#### b) **Farm Map**
- **Route:** `/map`
- **Icon:** `Map` (map icon)
- **Status:** Inactive
- **Badge:** "Soon" (gray text, indicates coming feature)

#### c) **Analytics**
- **Route:** `/analytics`
- **Icon:** `BarChart3` (bar chart icon)
- **Status:** Active when on analytics page
- **Badge:** "Week 3" (indicates planned release timeline)

#### d) **Settings**
- **Route:** `/settings`
- **Icon:** `Settings` (gear icon)
- **Status:** Active when on settings page
- **Badge:** None

**Features:**
- **Active State:** Highlights current page with active styling
- **Badges:** Shows status indicators ("Soon", "Week 3")
- **Routing:** Uses React Router `Link` component for navigation
- **Group Label:** "Platform" label above menu items

**Code Location:** `src/components/nav-main.tsx` (Lines 13-66)

---

### 4. **User Account Section** (`NavUser` Component)

**Component:** `src/components/nav-user.tsx`

**Display:**
- **Avatar:** User profile image (fallback: initials "CN")
- **Name:** "Adib Salama" (hardcoded in `app-sidebar.tsx`)
- **Email:** "adibsalama@example.com" (hardcoded)
- **Chevron Icon:** Indicates dropdown menu available

**Dropdown Menu Options:**

#### Account Section:
- **Upgrade to Pro** - Sparkles icon
  - Premium feature access

#### Settings Section:
- **Account** - BadgeCheck icon
  - Account management
- **Billing** - CreditCard icon
  - Payment and subscription
- **Notifications** - Bell icon
  - Notification preferences

#### Actions:
- **Log out** - LogOut icon
  - Sign out functionality

**Features:**
- **Dropdown Menu:** Opens on click, positioned right (desktop) or bottom (mobile)
- **Responsive:** Adjusts position based on screen size
- **Avatar Fallback:** Shows "CN" if image fails to load
- **Separators:** Visual dividers between menu sections

**Code Location:** `src/components/nav-user.tsx` (Lines 31-112)

---

### 5. **Sidebar Behavior**

**Collapsible Mode:**
- Can collapse to icon-only view
- Triggered by `SidebarTrigger` button in header
- Maintains functionality in collapsed state
- Shows rail indicator when collapsed

**Responsive:**
- Adapts to mobile screens
- User dropdown adjusts position (bottom on mobile, right on desktop)

**State Management:**
- Uses Shadcn sidebar context for state
- Tracks mobile/desktop mode via `useSidebar()` hook

---

### 6. **Data Structure**

**Hardcoded User Data** (in `app-sidebar.tsx`):
```typescript
{
  user: {
    name: "Adib Salama",
    email: "adibsalama@example.com",
    avatar: "/avatars/shadcn.jpg"
  }
}
```

**Note:** This is placeholder data. Should be replaced with actual user data from auth context.

**Unused Data** (in `app-sidebar.tsx`):
- `teams` array - Not currently displayed
- `navMain` array - Not used (actual nav uses `NavMain` component)
- `projects` array - Not currently displayed

**Code Location:** Lines 28-101 (data object defined but partially unused)

---

### 7. **Component Dependencies**

**UI Components:**
- `Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`
- `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`
- `SidebarGroup`, `SidebarGroupLabel`
- `SidebarRail` - Visual indicator
- `Avatar`, `AvatarImage`, `AvatarFallback`
- `DropdownMenu` components

**Icons:**
- `LayoutDashboard`, `BarChart3`, `Settings`, `Map` (navigation)
- `BadgeCheck`, `Bell`, `ChevronsUpDown`, `CreditCard`, `LogOut`, `Sparkles` (user menu)

**Routing:**
- React Router `Link` component
- `useLocation` hook for active state detection

---

### 8. **Integration with Dashboard**

**Usage in Dashboard:**
```tsx
<SidebarProvider>
  <AppSidebar />
  <SidebarInset>
    {/* Dashboard content */}
  </SidebarInset>
</SidebarProvider>
```

**Layout:**
- `SidebarProvider` - Context provider for sidebar state
- `AppSidebar` - Sidebar component (left side)
- `SidebarInset` - Main content area (right side, adjusts when sidebar collapses)

**Interaction:**
- Sidebar toggle button in dashboard header controls sidebar visibility
- Sidebar collapses/expands without affecting content layout
- Content area automatically adjusts width

---

### 9. **Styling & Theming**

**Theme Support:**
- Uses CSS variables for theming (`hsl(var(--sidebar-*))`)
- Supports light/dark mode (via theme system)
- Consistent with Shadcn UI design system

**Visual Elements:**
- Hover effects on menu items
- Active state highlighting
- Smooth transitions for collapse/expand
- Badge styling for status indicators

---

### 10. **Future Enhancements Needed**

**Navigation:**
- Connect "Farm Map" route when implemented
- Update user data to use actual auth context
- Implement logout functionality
- Connect "Upgrade to Pro" and other menu items

**Features:**
- Replace hardcoded user data with `useAuth()` hook
- Add team/project switching if needed
- Implement notification badge count
- Add keyboard shortcuts for navigation

---

## 📝 Summary

### Dashboard
- **Purpose:** Real-time agricultural monitoring dashboard
- **Key Features:** Metric cards, charts, alerts, recent readings
- **Data Source:** Zustand store with 30-second polling
- **Responsive:** Mobile-first design with breakpoints

### Sidebar
- **Purpose:** Navigation and user account access
- **Key Features:** Page navigation, user dropdown, collapsible design
- **Status:** Functional navigation, placeholder user data
- **Responsive:** Adapts to mobile/desktop layouts

Both components work together to provide a complete user interface for the SWAMP agricultural monitoring platform.

