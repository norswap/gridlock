/**
 * This module contains logic that runs as a side-effect of module iniitalization, and should be run
 * first thing when the app launches. It sets up various hooks and customizations.
 *
 * @module setup
 */

// We're doing too much magic here.
// @ts-nocheck

// =================================================================================================
// SETUP

// Called at bottom of this file.
function setup() {
    setupBigintSerialization()
}

// =================================================================================================
// JSON SERIALIZATION/DESERIALIZATION

// Enable BigInts to be serialized to / deserialized from JSON.
// This is needed for debug tools to handle BigInt in React state, and is just a lot more convenient
// than adding explicit parsing everywhere in general.
function setupBigintSerialization() {
  // Same behaviour as wagmi serialize/deserialize, but hand-rolled because redefining
  // stringify/parse in terms of the wagmi function creates infinite recursion.

  // Serialization
  const oldStringify = JSON.stringify["oldStringify"] ?? JSON.stringify
  JSON.stringify = (value, replacer, space) => {
    return oldStringify(
      value,
      (key, value) => {
        if (typeof value === "bigint") return `#bigint.${value}`
        else if (typeof replacer === "function") return replacer(key, value)
        else return value
      },
      space
    )
  }
  JSON.stringify["oldStringify"] = oldStringify

  // Deserialization
  const oldParse = JSON.parse["oldParse"] ?? JSON.parse
  JSON.parse = (text, reviver) => {
    return oldParse(text, (key, value) => {
      // We only values of shape "#bigint.<data>"
      if (typeof value === "string" && value.startsWith("#bigint.")) return BigInt(value.slice(8)).valueOf()
      // Otherwise fallback to normal behavior
      if (typeof reviver === "function") return reviver(key, value)
      else return value
    })
  }
  JSON.parse["oldParse"] = oldParse
}

// =================================================================================================

setup()

// =================================================================================================
