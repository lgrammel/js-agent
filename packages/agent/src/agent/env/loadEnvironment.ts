import { LoadEnvironmentKeyFunction } from "./LoadEnvironmentKeyFunction";

export async function loadEnvironment<
  ENVIRONMENT extends Record<string, string>
>(
  environment: Record<keyof ENVIRONMENT, LoadEnvironmentKeyFunction>
): Promise<ENVIRONMENT> {
  const loadedEnvironment: Record<string, string> = {};

  for (const key of Object.keys(environment)) {
    const load = environment[key as keyof ENVIRONMENT];
    loadedEnvironment[key] = await load(key);
  }

  return loadedEnvironment as ENVIRONMENT;
}
