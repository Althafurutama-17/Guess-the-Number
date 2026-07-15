// ===================== State =====================
// Objek tunggal (singleton) yang dimutasi di tempat oleh semua modul.
export const state = {
  mode: "single",
  level: "brain",
  secret1: null,
  secret2: null,
  // single
  score: 0,
  tries: 0,
  singleTipCount: 0,
  // double
  p1Score: 0,
  p2Score: 0,
  p1Locked: false,
  p2Locked: false,
  p1TipCount: 0,
  p2TipCount: 0,
  doubleWinner: false,
  doubleRound: 1,
  doubleTurn: 1,
};
