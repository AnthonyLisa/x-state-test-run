import React, { ReactNode, useCallback, useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import styles from "./Flow.module.scss";
import { FlowMachine } from "./machine";
import { MetaFlowContext, MetaFlowContextItem } from "./interfaces";
import { SingleSelectTemplate } from "../templates";
import { InspectedSnapshotEvent, Snapshot } from "xstate";

const getClassName = (state: MetaFlowContextItem["state"]) => {
  if (state === "enabled") {
    return styles.enabled;
  }

  if (state === "hidden") {
    return styles.hidden;
  }

  return styles.disabled;
};

const Header: React.FC<{
  title: string;
  onClose?: () => void;
  onBack?: () => void;
  meta: MetaFlowContext;
  hasBack: boolean;
}> = ({ title, onClose, onBack, meta, hasBack }) => {
  const { state = "enabled", text } = meta.close ?? {};

  return (
    <div className={styles.header}>
      <button
        className={`${styles.back} ${!hasBack && styles.hidden}`}
        disabled={!hasBack}
        onClick={onBack}
      >
        {text ?? "<-"}
      </button>
      <h3 className={styles.title}>{title}</h3>
      <button
        className={`${styles.close} ${getClassName(state)}`}
        disabled={state !== "enabled"}
        onClick={onClose}
      >
        {text ?? "X"}
      </button>
    </div>
  );
};

const Footer: React.FC<{ onNext: () => void; meta: MetaFlowContext }> = ({
  onNext,
  meta,
}) => {
  const { state = "enabled", text } = meta.next ?? {};

  return (
    <footer className={styles.footer}>
      <button
        // style={style}
        className={`${styles.next} ${getClassName(state)}`}
        disabled={state !== "enabled"}
        onClick={onNext}
      >
        {text ?? "Next"}
      </button>
    </footer>
  );
};

const LandingStep = () => <p>Nice to meet you!</p>;

const FinalStep: React.FC<{ title: string }> = ({ title }) => <p>{title} </p>;

const GENDER_OPTIONS = [
  {
    text: "Male",
    value: "male",
  },
  {
    text: "Female",
    value: "female",
  },
] satisfies SingleSelectTemplate.Item<"male" | "female">[];

export const Flow = () => {
  const [state, send] = useMachine(FlowMachine);

  const { meta } = state.context;

  return (
    <div className={styles.root}>
      <Header
        title="MTF 2: Eletric Boogaloo"
        onClose={() => send({ type: "close" })}
        onBack={() => send({ type: "back" })}
        meta={meta}
        hasBack={state.can({ type: "back" })}
      />
      <main className={styles.content}>
        {state.matches("landing") && <LandingStep />}
        {state.matches("gender") && (
          <SingleSelectTemplate
            selectedItem={state.context.gender}
            data={GENDER_OPTIONS}
            onSelect={(value) => send({ type: "set.gender", value })}
          />
        )}
        {state.matches("male") && (
          <FinalStep
            title={`Hey bro, seems like you are a ${state.context.gender}`}
          />
        )}
        {state.matches("female") && (
          <FinalStep title={`Nice to meet you, ${state.context.gender} lady`} />
        )}
        {state.matches("notSure") && <FinalStep title="Not sure? 👀" />}
        {state.matches("closed") && (
          <FinalStep title="Why did you close me? 😔" />
        )}
      </main>
      <Footer onNext={() => send({ type: "next" })} meta={meta} />
    </div>
  );
};
