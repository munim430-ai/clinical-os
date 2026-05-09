import { isSupabaseConfigured, requireSupabase, supabase } from "@/lib/supabase";

export type DoctorProfile = {
  id: string;
  auth_user_id: string;
  display_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type DoctorLocation = {
  id: string;
  doctor_id: string;
  name: string;
  address: string | null;
  default_new_fee_bdt: number;
  default_old_fee_bdt: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type DoctorWalletEntry = {
  id: string;
  doctor_id: string;
  location_id: string;
  entry_date: string;
  new_patient_count: number;
  old_patient_count: number;
  new_fee_bdt: number;
  old_fee_bdt: number;
  total_bdt: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type WalletLocationSummary = {
  location: DoctorLocation;
  todayTotal: number;
  todayPatients: number;
  monthTotal: number;
  lifetimeTotal: number;
  lifetimePatients: number;
};

export type WalletDashboard = {
  profile: DoctorProfile;
  locations: DoctorLocation[];
  entries: DoctorWalletEntry[];
  summaries: WalletLocationSummary[];
  todayTotal: number;
  todayPatients: number;
  monthTotal: number;
};

export type WalletAuthState =
  | { status: "not-configured" }
  | { status: "signed-out" }
  | { status: "signed-in"; profile: DoctorProfile };

export function formatBdt(amount: number) {
  return `${Math.round(amount).toLocaleString("en-BD")} BDT`;
}

export function formatLocalDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function calculateWalletTotal(input: {
  newPatientCount: number;
  oldPatientCount: number;
  newFeeBdt: number;
  oldFeeBdt: number;
}) {
  return (
    input.newPatientCount * input.newFeeBdt +
    input.oldPatientCount * input.oldFeeBdt
  );
}

export function summarizeWallet(
  locations: DoctorLocation[],
  entries: DoctorWalletEntry[],
  today = formatLocalDate(),
): Omit<WalletDashboard, "profile"> {
  const monthPrefix = today.slice(0, 7);
  const summaries = locations.map((location) => {
    const locationEntries = entries.filter(
      (entry) => entry.location_id === location.id,
    );
    const todayEntries = locationEntries.filter(
      (entry) => entry.entry_date === today,
    );
    const monthEntries = locationEntries.filter((entry) =>
      entry.entry_date.startsWith(monthPrefix),
    );

    return {
      location,
      todayTotal: sumTotals(todayEntries),
      todayPatients: sumPatients(todayEntries),
      monthTotal: sumTotals(monthEntries),
      lifetimeTotal: sumTotals(locationEntries),
      lifetimePatients: sumPatients(locationEntries),
    };
  });

  return {
    locations,
    entries,
    summaries,
    todayTotal: sumTotals(entries.filter((entry) => entry.entry_date === today)),
    todayPatients: sumPatients(
      entries.filter((entry) => entry.entry_date === today),
    ),
    monthTotal: sumTotals(
      entries.filter((entry) => entry.entry_date.startsWith(monthPrefix)),
    ),
  };
}

function sumTotals(entries: DoctorWalletEntry[]) {
  return entries.reduce((total, entry) => total + Number(entry.total_bdt), 0);
}

function sumPatients(entries: DoctorWalletEntry[]) {
  return entries.reduce(
    (total, entry) =>
      total +
      Number(entry.new_patient_count) +
      Number(entry.old_patient_count),
    0,
  );
}

export async function getWalletAuthState(): Promise<WalletAuthState> {
  if (!isSupabaseConfigured || !supabase) return { status: "not-configured" };
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session?.user) return { status: "signed-out" };
  const profile = await getOrCreateDoctorProfile();
  return { status: "signed-in", profile };
}

export async function sendWalletPhoneOtp(phone: string) {
  const client = requireSupabase();
  const { error } = await client.auth.signInWithOtp({ phone });
  if (error) throw error;
}

export async function verifyWalletPhoneOtp(phone: string, token: string) {
  const client = requireSupabase();
  const { error } = await client.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });
  if (error) throw error;
  return getOrCreateDoctorProfile();
}

export async function signOutWallet() {
  const client = requireSupabase();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

export async function getOrCreateDoctorProfile(displayName?: string) {
  const client = requireSupabase();
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();
  if (userError) throw userError;
  if (!user) throw new Error("Sign in to use Doctor Wallet.");

  const { data: existing, error: existingError } = await client
    .from("doctor_profiles")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) return existing as DoctorProfile;

  const { data, error } = await client
    .from("doctor_profiles")
    .insert({
      auth_user_id: user.id,
      display_name: displayName ?? user.phone ?? "Doctor",
      phone: user.phone ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as DoctorProfile;
}

export async function getWalletDashboard(): Promise<WalletDashboard> {
  const profile = await getOrCreateDoctorProfile();
  const [locations, entries] = await Promise.all([
    listWalletLocations(profile.id),
    listWalletEntries(profile.id),
  ]);
  return {
    profile,
    ...summarizeWallet(locations, entries),
  };
}

export async function getWalletHomeSummary() {
  if (!isSupabaseConfigured || !supabase) {
    return {
      status: "not-configured" as const,
      todayTotal: 0,
      todayPatients: 0,
      locationCount: 0,
    };
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session?.user) {
    return {
      status: "signed-out" as const,
      todayTotal: 0,
      todayPatients: 0,
      locationCount: 0,
    };
  }

  const dashboard = await getWalletDashboard();
  return {
    status: "ready" as const,
    todayTotal: dashboard.todayTotal,
    todayPatients: dashboard.todayPatients,
    locationCount: dashboard.locations.length,
  };
}

export async function listWalletLocations(doctorId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("doctor_locations")
    .select("*")
    .eq("doctor_id", doctorId)
    .eq("active", true)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as DoctorLocation[];
}

export async function createWalletLocation(input: {
  doctorId: string;
  name: string;
  address?: string;
  defaultNewFeeBdt: number;
  defaultOldFeeBdt: number;
}) {
  const client = requireSupabase();
  const { data, error } = await client
    .from("doctor_locations")
    .insert({
      doctor_id: input.doctorId,
      name: input.name.trim(),
      address: input.address?.trim() || null,
      default_new_fee_bdt: clampMoney(input.defaultNewFeeBdt),
      default_old_fee_bdt: clampMoney(input.defaultOldFeeBdt),
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as DoctorLocation;
}

export async function listWalletEntries(doctorId: string, locationId?: string) {
  const client = requireSupabase();
  let query = client
    .from("doctor_wallet_entries")
    .select("*")
    .eq("doctor_id", doctorId)
    .order("entry_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (locationId) query = query.eq("location_id", locationId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as DoctorWalletEntry[];
}

export async function createWalletEntry(input: {
  doctorId: string;
  locationId: string;
  entryDate: string;
  newPatientCount: number;
  oldPatientCount: number;
  newFeeBdt: number;
  oldFeeBdt: number;
  notes?: string;
}) {
  const client = requireSupabase();
  const newPatientCount = clampCount(input.newPatientCount);
  const oldPatientCount = clampCount(input.oldPatientCount);
  const newFeeBdt = clampMoney(input.newFeeBdt);
  const oldFeeBdt = clampMoney(input.oldFeeBdt);
  const totalBdt = calculateWalletTotal({
    newPatientCount,
    oldPatientCount,
    newFeeBdt,
    oldFeeBdt,
  });

  const { data, error } = await client
    .from("doctor_wallet_entries")
    .insert({
      doctor_id: input.doctorId,
      location_id: input.locationId,
      entry_date: input.entryDate,
      new_patient_count: newPatientCount,
      old_patient_count: oldPatientCount,
      new_fee_bdt: newFeeBdt,
      old_fee_bdt: oldFeeBdt,
      total_bdt: totalBdt,
      notes: input.notes?.trim() || null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as DoctorWalletEntry;
}

function clampCount(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.floor(value));
}

function clampMoney(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.round(value));
}
