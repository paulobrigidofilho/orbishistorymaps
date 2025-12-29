///////////////////////////////////////////////////////////////////////
// ================== FETCH STATS FUNCTION =========================== //
///////////////////////////////////////////////////////////////////////

// This function handles fetching admin dashboard statistics

//  ========== Function imports  ========== //
import getAdminStats from "./getAdminStats";

///////////////////////////////////////////////////////////////////////
// ====================== FETCH STATS =============================== //
///////////////////////////////////////////////////////////////////////

/**
 * Fetch admin dashboard statistics
 */
export default async function fetchStats(setStats, setLoading) {
  try {
    setLoading(true);
    const data = await getAdminStats();
    setStats(data);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    throw error;
  } finally {
    setLoading(false);
  }
}
