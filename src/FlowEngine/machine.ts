import { setup, spawnChild, type AnyStateMachine } from "xstate";

export const createFlow = <M extends AnyStateMachine>(flow: M) => {
  return setup({
    actions: { startFlow: spawnChild(flow) },
  }).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QFEB2UCWqwDoA2A9gIYRZQDEAHrAC5E25EBmDATgBQBMADLwJTk0mbPmKl0AbW4BdRKAAOBWBhoYCqOSEqIAjADYArDgCcB7gHYAzOYAslnQA4DN45wA0IAJ67uRp+YM9bgdjPWMHWwcAXyiPISwwcgBjQlgwKVkkEEVlVXVNbQQzHHNjGxsHTkq9RwrLD28EcpxLAwDnZ259W04Y2JBUAgg4TXjsTRyVNQ0sws4SsoqqzhqHOvqvRABaOxwdG05ym2DLPXtLGLj0BNESMgmlKfzZxANLHBsdbuMypwMzAwNHw2HD+ZxrbiccKGGyXEBjXCsACuqFQ9yykzyM1AhUsFhwnHs0IMK0JpSBCAcOhabUCZwMOmsZmi-QROBSSkgD1y0wKukMJjMVls9icLncmyaILBHWO3QOfSiQA */
    id: "Engine",

    states: {
      loading: {
        after: {
          "2000": "running",
        },
      },

      running: {
        entry: "startFlow",
      },

      closed: {},
    },

    initial: "loading",

    on: {
      close: ".closed",
    },
  });
};
