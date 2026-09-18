import {createApi} from "@reduxjs/toolkit/query/react"
import axiosBaseQuery from "./axiosBaseQuery"

export const baseApi = createApi({
    reducerPath:'baseApi',
    baseQuery: axiosBaseQuery(),
    tagTypes:["USER","RFQ","CONTACT","PRODUCT","CARRIER",'QUOTATION',"REPORT","ORDER","SHIPMENT","FLEET","DRIVER","DASHBOARD_STATS"],
    refetchOnMountOrArgChange: true,
    endpoints: ()=>({})
})
