/**
 * Sets up the store as a side-effect of module initialization.
 *
 * Similar to `src/setup`, but can't be called from there because of a cyclical dependency (loading
 * storage-loaded atoms needs a JSON parsing hook to be setup).
 *
 * @module store/setup
 */

// =================================================================================================

function setupStore() {
    if (typeof window === "undefined")
        // Do not set up subscriptions and timers on the server.
        return
}

// =================================================================================================

setupStore()

// =================================================================================================
