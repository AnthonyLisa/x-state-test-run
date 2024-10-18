export interface MetaFlowContextItem {
  text?: string;
  state: "hidden" | "disabled" | "enabled";
}

export interface MetaFlowContext {
  back?: MetaFlowContextItem;
  close?: MetaFlowContextItem;
  next?: MetaFlowContextItem;
}
