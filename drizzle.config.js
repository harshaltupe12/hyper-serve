/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.tsx",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://mock%20master_owner:vP4LlnBFUdX8@ep-patient-butterfly-a187sbtr.ap-southeast-1.aws.neon.tech/hyper-serve?sslmode=require',
    }
  };