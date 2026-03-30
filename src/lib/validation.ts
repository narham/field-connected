/**
 * Age validation for player registration in competitions.
 */

export interface AgeValidationResult {
  valid: boolean;
  age: number;
  reason: string;
}

/**
 * Validate if a player's age is within the category limit.
 * @param birthDate - Player's birth date (ISO string)
 * @param ageLimit - Maximum age allowed for the category
 * @param referenceDate - Date to calculate age against (competition start date)
 */
export function validatePlayerAge(
  birthDate: string,
  ageLimit: number,
  referenceDate: string = new Date().toISOString()
): AgeValidationResult {
  const birth = new Date(birthDate);
  const ref = new Date(referenceDate);

  let age = ref.getFullYear() - birth.getFullYear();
  const monthDiff = ref.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && ref.getDate() < birth.getDate())) {
    age--;
  }

  if (age > ageLimit) {
    return {
      valid: false,
      age,
      reason: `Umur ${age} tahun melebihi batas ${ageLimit} tahun`,
    };
  }

  return {
    valid: true,
    age,
    reason: `Umur ${age} tahun (valid untuk U-${ageLimit})`,
  };
}

/**
 * Check for duplicate player registration across competitions.
 */
export function checkDuplicatePlayer(
  playerGlobalId: string,
  registeredPlayerIds: string[]
): boolean {
  return registeredPlayerIds.includes(playerGlobalId);
}
