import { logElapsedTime } from "@holdenmatt/ts-utils";

import { initializeWorker, Pyodide } from "./pyodide-api";
import { DEBUG, setDebug } from "./config";

let pyodide: Promise<Pyodide> | undefined;

/**
 * Initialize Pyodide, ensuring we only initialize it once.
 *
 * @param debug If true, log debug messages and elapsed times to the console.
 * @param packages Additional python package names to load.
 */
export async function initializePyodide(options?: {
  debug: boolean;
  packages?: string[];
  stdoutFunc?: (msg: string) => void;
}): Promise<Pyodide> {
  const { debug = false, packages } = options || {};
  setDebug(debug)

  if (pyodide === undefined) {
    pyodide = _initializePyodide(packages, stdoutFunc);
  }
  return pyodide;
}

/**
 * Initialize Pyodide, and load any given packages.
 */
const _initializePyodide = async (packages?: string[], stdoutFunc?: (msg: string) => void): Promise<Pyodide> => {
  const start = performance.now();

  pyodide = initializeWorker(packages, stdoutFunc);

  DEBUG && logElapsedTime("Pyodide initialized", start);
  return pyodide;
};

/**
 * Get the pyodide instance, initializing it if needed.
 *
 * Typically `usePyodide` is used in React components instead, but this
 * method provides access outside of React contexts.
 */
export const getPyodide = async (): Promise<Pyodide> => {
  if (pyodide) {
    return pyodide;
  } else {
    return await initializePyodide();
  }
};
