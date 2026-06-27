export const INSTITUTION_DOMAIN_MAX_LENGTH = 100;

export const INSTITUTION_DOMAIN_REGEX =
  /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/;

export const INSTITUTION_DOMAIN_MESSAGE =
  "Enter a full domain with an extension (e.g. eldoretpolytechnic.ac.ke, .com, .edu)";

export const RESERVED_INSTITUTION_DOMAIN_LABELS = new Set([
  "www",
  "admin",
  "api",
  "app",
  "mail",
]);

export function normalizeInstitutionDomain(value: string) {
  return value.trim().toLowerCase();
}

export function getInstitutionDomainLabel(domain: string) {
  return normalizeInstitutionDomain(domain).split(".")[0];
}

export function isReservedInstitutionDomain(domain: string) {
  return RESERVED_INSTITUTION_DOMAIN_LABELS.has(
    getInstitutionDomainLabel(domain),
  );
}
