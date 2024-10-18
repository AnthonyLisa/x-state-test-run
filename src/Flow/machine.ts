import { setup, assign } from "xstate";
import { MetaFlowContext, MetaFlowContextItem } from "./interfaces";
import { isNotNil } from "../helpers/utils";

namespace FlowMachine {
  export interface Context {
    meta: MetaFlowContext;
    gender: "male" | "female" | null;
  }

  export type Event =
    | { type: "close" }
    | { type: "back" }
    | { type: "next" }
    | { type: "set.gender"; value: "male" | "female" };
}

export const FLOW_MACHINE_ID = "flow";

type SetControl<K extends keyof MetaFlowContext> = (
  state: NonNullable<MetaFlowContext[K]>["state"],
  text?: NonNullable<MetaFlowContext[K]>["text"]
) => { [key in K]: MetaFlowContextItem };

const setNext: SetControl<"next"> = (state, text) => ({
  next: {
    state,
    text,
  },
});

const setClose: SetControl<"close"> = (state, text) => ({
  close: {
    state,
    text,
  },
});

const setBack: SetControl<"back"> = (state, text) => ({
  back: {
    state,
    text,
  },
});

const hideAllControls = [
  setNext("hidden"),
  setClose("hidden"),
  setBack("hidden"),
];

export const FlowMachine = setup({
  types: {
    context: {} as FlowMachine.Context,
    events: {} as FlowMachine.Event,
  },
  guards: {
    isNotNil: (_, params: { value: unknown }) => isNotNil(params.value),
    isMale: ({ context }) => context.gender === "male",
  },
  actions: {
    resetControls: assign({ meta: undefined }),
    updateControls: assign(({ context }, newMeta: MetaFlowContext[]) => {
      const updatedMeta = newMeta.reduce(
        (total, item) => ({ ...total, ...item }),
        {}
      );
      return {
        meta: {
          ...context.meta,
          ...updatedMeta,
        },
      };
    }),
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDMA2B7A7gYgMYdjAG0AGAXUVAAd1YBLAFzvQDtKQAPRAFgCYAaEAE9EAZgCMAVgB0UgGy8AnAHZxJEgA5l27gF9dgtFmmoAhiwh0WUbCzAcGpCkhA16TVuy4Jey0dO5RZUkJEnFeEkleXjlBER9REgCSBTlxbkDlDRJRSX1DDExpGAswACdsQgZisFKyp3Y3RmY2F28ojWkSLPEtbkVeSQ1JcTjEDXFpSXUwkgiVOWC9AxAjIpKIctt7R3JG2mbPNsQ-OWkJQcVE0TTJOQ0xhHEpaV5RRUlFbhJFOVEYtL5VaFGp1bYOIjiZzUA4eVqgbync7hT7XW73R6iDKvd5pK5SRQaXjDIFrUGbCoAI1MuAA1g0XE04V4eGEpldlJF-uFlGlYsJEOJlIppIoUtE5HcvuplKSQRsthxYAxTAwwNJTMg1WUABTTdQASmwZIV9T2jNhLRZCCRF1ROXRDwFCTOYoUWRCE20VzlxhY6AYAGUAK5lMDYal0hkw9xW44IDSS87EwaLKRDQmPXpnb4KRNXe7TDQafQrf2beAuNb7WNHBGIAC0-PiDZkinb7ZuJH6SmUvjkvqKZgsVigNcO8M4PAEzvEikm3A0HxUSkTWKGg-J5XHzPj-RFWmmCjm3DU3GbiHmovFizkX14vXPm4AtqZUGAd3H6whfv45D8MhyGIIiyR4xVFJd-1PCQtF4TdkDAV930-Ospx-P5pH-L5vn+Y9QOdRJuACSC50WB9RBLFYyXwWhIBQydvF8fxMhCNRwkiCVHiUJI3SUP5enEAcqJBf0g1DD8LVrBjEF-TCAJw4DuideI506Qllz7Qk-m4DdSyAA */
  id: FLOW_MACHINE_ID,

  initial: "landing",

  context: {
    meta: {},
    gender: null,
  },

  states: {
    landing: {
      entry: [
        {
          type: "updateControls",
          params: [setNext("enabled")],
        },
      ],
      on: {
        next: {
          target: "gender",
        },
      },
    },

    gender: {
      entry: {
        type: "updateControls",
        params: ({ context }) => [
          setNext(isNotNil(context.gender) ? "enabled" : "disabled"),
        ],
      },

      on: {
        "set.gender": {
          actions: [
            assign({
              gender: ({ event }) => {
                return event.value;
              },
            }),
            {
              type: "updateControls",
              params: ({ context }) => [
                setNext(isNotNil(context.gender) ? "enabled" : "disabled"),
              ],
            },
          ],
        },

        next: [
          {
            guard: "isMale",
            target: "male",
          },
          {
            guard: {
              type: "isNotNil",
              params: ({ context }) => ({ value: context.gender }),
            },
            target: "female",
          },
        ],

        back: "landing",
      },

      output: ({ context }) => context.gender,

      after: {
        5000: "notSure",
      },
    },

    male: {
      entry: {
        type: "updateControls",
        params: [setNext("hidden"), setClose("hidden")],
      },

      type: "final",
    },

    female: {
      type: "final",

      entry: {
        type: "updateControls",
        params: [setNext("hidden"), setClose("hidden")],
      },
    },

    closed: {
      type: "final",
      entry: {
        type: "updateControls",
        params: hideAllControls,
      },
    },

    notSure: {
      entry: { type: "updateControls", params: hideAllControls },

      on: {
        back: "gender",
      },
    },
  },

  on: {
    close: {
      target: ".closed",
    },
  },
});
