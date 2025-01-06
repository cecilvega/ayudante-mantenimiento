"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Loader2,
  Database,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import MainLayout from "@/app/components/layout/MainLayout";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { fetchEquipos, fetchPersonas } from "@/lib/services";
import { fetchAttendances } from "@/lib/services";

type FirebaseDoc<T extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
} & T;

type CollectionState<T extends Record<string, unknown> = Record<string, unknown>> = {
  data: Record<string, FirebaseDoc<T>>;
  loading: boolean;
  error: Error | null;
};

export default function CacheManagerPage() {
  const [openCollections, setOpenCollections] = React.useState<
    Record<string, boolean>
  >({});

  // States for each collection
  const [personas, setPersonas] = React.useState<CollectionState>({
    data: {},
    loading: true,
    error: null,
  });

  const [equipment, setEquipment] = React.useState<CollectionState>({
    data: {},
    loading: true,
    error: null,
  });

  const [attendance, setAttendance] = React.useState<CollectionState>({
    data: {},
    loading: true,
    error: null,
  });

  // Fetch functions for each collection
  const refreshPersonas = async () => {
    try {
      setPersonas((prev) => ({ ...prev, loading: true, error: null }));
      const data = await fetchPersonas();
      setPersonas({ data, loading: false, error: null });
    } catch (error) {
      setPersonas((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
    }
  };

  const refreshEquipos = async () => {
    try {
      setEquipment((prev) => ({ ...prev, loading: true, error: null }));
      const data = await fetchEquipos();
      setEquipment({ data, loading: false, error: null });
    } catch (error) {
      setEquipment((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
    }
  };

  const refreshAttendances = async () => {
    try {
      setAttendance((prev) => ({ ...prev, loading: true, error: null }));
      const today = new Date();
      const data = await fetchAttendances(today);
      setAttendance({ data, loading: false, error: null });
    } catch (error) {
      setAttendance((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error : new Error(String(error)),
      }));
    }
  };

  // Initial data fetch
  React.useEffect(() => {
    refreshPersonas();
    refreshEquipos();
    refreshAttendances();
  }, []);

  const refreshAllCaches = async () => {
    try {
      await Promise.all([
        refreshPersonas(),
        refreshEquipos(),
        refreshAttendances(),
      ]);
    } catch (error) {
      console.error("Error refreshing caches:", error);
    }
  };

  const collections = [
    {
      name: "Personal",
      state: personas,
      refresh: refreshPersonas,
      color: "bg-blue-500",
    },
    {
      name: "Equipos",
      state: equipment,
      refresh: refreshEquipos,
      color: "bg-green-500",
    },
    {
      name: "Asistencia",
      state: attendance,
      refresh: refreshAttendances,
      color: "bg-purple-500",
    },
  ];

  const toggleCollection = (name: string) => {
    setOpenCollections((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const getColumnOrder = (data: Record<string, FirebaseDoc>) => {
    if (!data || Object.keys(data).length === 0) return [];
    const firstDoc = Object.values(data)[0];
    return Object.keys(firstDoc).filter((key) => key !== "id");
  };

  const renderTableHeaders = (data: Record<string, FirebaseDoc>) => {
    if (!data || Object.keys(data).length === 0) return null;
    const columns = getColumnOrder(data);

    // Limit to max 4 columns to prevent overflow
    const displayColumns = columns.slice(0, 4);

    return (
      <tr>
        <th className="sticky left-0 bg-gray-100 z-30 px-2 py-1 text-left font-medium text-xs truncate w-[100px]">
          Doc ID
        </th>
        {displayColumns.map((column) => (
          <th
            key={column}
            className="px-2 py-1 text-left font-medium text-xs truncate w-[100px]"
          >
            {column}
          </th>
        ))}
      </tr>
    );
  };

  const renderTableRows = (data: Record<string, FirebaseDoc>) => {
    if (!data) return null;
    const columns = getColumnOrder(data);

    // Limit to max 4 columns to prevent overflow
    const displayColumns = columns.slice(0, 4);

    return Object.entries(data).map(([docId, record]) => (
      <tr key={docId} className="border-b hover:bg-gray-50">
        <td className="sticky left-0 bg-white z-20 px-2 py-1 border-r text-xs truncate w-[100px]">
          {docId}
        </td>
        {displayColumns.map((column) => {
          const cellValue =
            typeof record[column] === "object"
              ? JSON.stringify(record[column])
              : String(record[column] || "");

          return (
            <td
              key={column}
              className="px-2 py-1 text-xs truncate w-[100px]"
              title={cellValue}
            >
              {cellValue}
            </td>
          );
        })}
      </tr>
    ));
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="bg-gradient-to-r from-[#140a9a] to-[#1b0ecc] text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-6 w-6" />
                <CardTitle className="text-2xl">Cache Manager</CardTitle>
              </div>
              <Button
                onClick={refreshAllCaches}
                variant="secondary"
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh All Caches
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6">
              {collections.map(({ name, state, refresh, color }) => (
                <Collapsible
                  key={name}
                  open={openCollections[name]}
                  onOpenChange={() => toggleCollection(name)}
                >
                  <div className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        <h3 className="text-lg font-semibold">{name}</h3>
                      </div>
                      {state.loading && (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Cached Records</p>
                        <p className="text-2xl font-bold text-[#140a9a]">
                          {Object.keys(state.data || {}).length}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-500">Cache Status</p>
                        <p className="text-lg font-semibold text-gray-700">
                          {state.loading ? "Loading..." : "Ready"}
                        </p>
                      </div>
                    </div>

                    {state.error && (
                      <div className="bg-red-50 text-red-600 p-3 rounded-md">
                        {state.error.message}
                      </div>
                    )}

                    <div className="flex justify-between items-center gap-4">
                      <Button
                        onClick={refresh}
                        disabled={state.loading}
                        variant="outline"
                        className="flex-1"
                      >
                        {state.loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Refreshing...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Cache
                          </>
                        )}
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button variant="outline" size="icon">
                          {openCollections[name] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent>
                      {state.data && Object.keys(state.data).length > 0 ? (
                        <div className="mt-4 border rounded-md overflow-hidden">
                          <div className="max-h-[300px] overflow-auto">
                            <table className="w-full text-xs border-collapse">
                              <thead className="sticky top-0 z-20 bg-gray-100">
                                {renderTableHeaders(state.data)}
                              </thead>
                              <tbody>{renderTableRows(state.data)}</tbody>
                            </table>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No cached data available
                        </div>
                      )}
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
