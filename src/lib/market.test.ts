import { describe, it, expect } from "vitest";
import { coefficient, simulatedPrice, isTwoEuro, daysOfIncome } from "./market";

describe("market rules", () => {
  it("coefficient = revenus milliardaire / revenus foyer", () => {
    expect(Math.round(coefficient(3.2e9, 58000))).toBe(55172);
  });
  it("prix simulé = prix réel / coefficient", () => {
    expect(simulatedPrice(110000, 55000)).toBe(2);
  });
  it("Tout à 2 € filtre entre 1,50 et 2,50 €", () => {
    expect(isTwoEuro(110000, 55000)).toBe(true);
    expect(isTwoEuro(30000, 55000)).toBe(false);
  });
  it("jours de revenus sur base de 220 jours", () => {
    expect(daysOfIncome(58000, 58000)).toBe(220);
  });
});
