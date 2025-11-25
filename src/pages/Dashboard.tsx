import { useEffect } from 'react';
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSensorStore } from '@/stores/sensorStore';
import { MetricCard } from '@/components/MetricCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  Droplets, 
  Thermometer, 
  Wind, 
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function Dashboard() {
  const { 
    latestReading, 
    readings, 
    alerts, 
    isLoading, 
    error,
    lastUpdated,
    startPolling, 
    stopPolling,
    fetchData 
  } = useSensorStore();

  // Start polling on mount, stop on unmount
  useEffect(() => {
    startPolling(30000); // Poll every 30 seconds
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Prepare chart data (last 24 hours) - with safety check
  const chartData = Array.isArray(readings) 
    ? readings.slice(0, 24).reverse().map(reading => ({
        time: formatTime(reading.timestamp),
        moisture: reading.soilMoisture,
        temperature: reading.temperature
      }))
    : [];

  // Calculate trends
  const calculateTrend = (current: number, previous: number): { 
    direction: 'up' | 'down' | 'stable', 
    value: number 
  } => {
    if (!previous) return { direction: 'stable', value: 0 };
    const change = ((current - previous) / previous) * 100;
    if (Math.abs(change) < 1) return { direction: 'stable', value: 0 };
    return {
      direction: change > 0 ? 'up' : 'down',
      value: Math.abs(change)
    };
  };

  const previousReading = Array.isArray(readings) && readings.length > 1 ? readings[1] : null;
  const moistureTrend = previousReading 
    ? calculateTrend(latestReading?.soilMoisture || 0, previousReading.soilMoisture)
    : { direction: 'stable' as const, value: 0 };
  
  const tempTrend = previousReading
    ? calculateTrend(latestReading?.temperature || 0, previousReading.temperature)
    : { direction: 'stable' as const, value: 0 };

  const humidityTrend = previousReading
    ? calculateTrend(latestReading?.humidity || 0, previousReading.humidity)
    : { direction: 'stable' as const, value: 0 };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header with Breadcrumb */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-muted-foreground">
                    {lastUpdated 
                      ? `Updated ${new Date(lastUpdated).toLocaleTimeString()}`
                      : 'Loading...'
                    }
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-4">
            <Button 
              onClick={fetchData} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Critical Alerts */}
          {alerts.filter(a => a.type === 'critical').length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Critical Alert</AlertTitle>
              <AlertDescription>
                {alerts.find(a => a.type === 'critical')?.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Metric Cards Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {isLoading && !latestReading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <MetricCard
                  title="Soil Moisture"
                  value={latestReading?.soilMoisture || 0}
                  unit="%"
                  trend={moistureTrend.direction}
                  trendValue={moistureTrend.value}
                  icon={<Droplets className="h-4 w-4" />}
                />
                <MetricCard
                  title="Temperature"
                  value={latestReading?.temperature || 0}
                  unit="°C"
                  trend={tempTrend.direction}
                  trendValue={tempTrend.value}
                  icon={<Thermometer className="h-4 w-4" />}
                />
                <MetricCard
                  title="Humidity"
                  value={latestReading?.humidity || 0}
                  unit="%"
                  trend={humidityTrend.direction}
                  trendValue={humidityTrend.value}
                  icon={<Wind className="h-4 w-4" />}
                />
                <MetricCard
                  title="Water Used Today"
                  value={latestReading?.waterUsed || 0}
                  unit="L"
                  icon={<TrendingUp className="h-4 w-4" />}
                />
              </>
            )}
          </div>

          {/* Charts Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Soil Moisture Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Soil Moisture (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && chartData.length === 0 ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="moisture" 
                        stroke="hsl(var(--chart-1))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--chart-1))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Temperature Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Temperature (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading && chartData.length === 0 ? (
                  <Skeleton className="h-[250px] w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        className="text-muted-foreground"
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="temperature" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--destructive))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Readings</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && readings.length === 0 ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {Array.isArray(readings) && readings.slice(0, 5).map((reading) => (
                    <div 
                      key={reading.id}
                      className="flex items-center justify-between border-b pb-2 last:border-0"
                    >
                      <div className="text-sm">
                        <span className="font-medium">
                          {new Date(reading.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>💧 {reading.soilMoisture.toFixed(1)}%</span>
                        <span>🌡️ {reading.temperature.toFixed(1)}°C</span>
                      </div>
                    </div>
                  ))}
                  {(!Array.isArray(readings) || readings.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No readings available yet
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}