import { useEffect } from 'react';
import { useSensorStore } from '@/stores/sensorStore';

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

import { MetricCard } from '@/components/MetricCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import DebugPanel from '@/components/DebugPanel';
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

  useEffect(() => {
    startPolling(30000);
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const chartData = Array.isArray(readings)
    ? readings.slice(0, 24).reverse().map(r => ({
        time: formatTime(r.timestamp),
        moisture: r.soil_moisture,
        temperature: r.temperature
      }))
    : [];

  const calculateTrend = (
    current: number,
    previous: number
  ): { direction: 'up' | 'down' | 'stable'; value: number } => {
    if (!previous) return { direction: 'stable', value: 0 };
    const diff = ((current - previous) / previous) * 100;
    if (Math.abs(diff) < 1) return { direction: 'stable', value: 0 };
    return {
      direction: (diff > 0 ? 'up' : 'down') as 'up' | 'down',
      value: Math.abs(diff)
    };
  };

  const previous = Array.isArray(readings) && readings.length > 1 ? readings[1] : null;

  const moistureTrend: { direction: 'up' | 'down' | 'stable'; value: number } = previous
    ? calculateTrend(latestReading?.soil_moisture || 0, previous.soil_moisture || 0)
    : { direction: 'stable', value: 0 };

  const tempTrend: { direction: 'up' | 'down' | 'stable'; value: number } = previous
    ? calculateTrend(latestReading?.temperature || 0, previous.temperature || 0)
    : { direction: 'stable', value: 0 };

  const humidityTrend: { direction: 'up' | 'down' | 'stable'; value: number } = previous
    ? calculateTrend(latestReading?.humidity || 0, previous.humidity || 0)
    : { direction: 'stable', value: 0 };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
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
                      : 'Loading...'}
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

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {alerts.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Critical Alert</AlertTitle>
              <AlertDescription>{alerts[0].message}</AlertDescription>
            </Alert>
          )}

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
                  value={latestReading?.soil_moisture || 0}
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
                  value={latestReading?.water_used || 0}
                  unit="L"
                  icon={<TrendingUp className="h-4 w-4" />}
                />
              </>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Soil Moisture (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="moisture"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Temperature (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Readings</CardTitle>
            </CardHeader>
            <CardContent>
              {readings.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No readings yet
                </p>
              ) : (
                readings.slice(0, 5).map(r => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div className="text-sm font-medium">
                      {new Date(r.timestamp).toLocaleString()}
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>💧 {r.soil_moisture?.toFixed(1)}%</span>
                      <span>🌡️ {r.temperature?.toFixed(1)}°C</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
      <DebugPanel />
    </SidebarProvider>
  );
}
