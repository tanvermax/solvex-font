// src/redux/features/fleet/fleet.api.ts
import { baseApi } from "@/redux/baseApi";

export interface VehicleData {
  registrationNumber: string;
  type: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  capacity: number;
  capacityUnit: string;
  fuelType: string;
  driverId?: string;
  mileage: number;
  lastService: string;
  nextService: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  fuelLevel: number;
  fuelConsumption: number;
  notes?: string;
}

export interface DriverData {
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  experience: number;
  status: string;
  notes?: string;
}

export const fleetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: (filters) => ({
        url: "/admin/fleet/vehicles",
        method: "GET",
        params: filters,
      }),
      providesTags: ["FLEET"],
    }),
    getVehicleDetails: builder.query({
      query: (id: string) => ({
        url: `/admin/fleet/vehicles/${id}`,
        method: "GET",
      }),
      providesTags: ["FLEET"],
    }),
    addVehicle: builder.mutation({
      query: (data: VehicleData) => ({
        url: "/admin/fleet/vehicles",
        method: "POST",
        data,
      }),
      invalidatesTags: ["FLEET", "DASHBOARD_STATS"],
    }),
    updateVehicle: builder.mutation({
      query: ({ id, data }: { id: string; data: Partial<VehicleData> }) => ({
        url: `/admin/fleet/vehicles/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["FLEET", "DASHBOARD_STATS"],
    }),
    deleteVehicle: builder.mutation({
      query: (id: string) => ({
        url: `/admin/fleet/vehicles/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["FLEET", "DASHBOARD_STATS"],
    }),
    getDrivers: builder.query({
      query: (filters) => ({
        url: "/admin/fleet/drivers",
        method: "GET",
        params: filters,
      }),
      providesTags: ["DRIVER"],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetVehicleDetailsQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetDriversQuery,
} = fleetApi;