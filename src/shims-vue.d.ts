/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
declare interface IZipObject {
  (arr1: string[], arr2: (string | number)[]): object;
}
interface IFunctions {
  zipObject: IZipObject;
}
interface IPayload {
  key: string;
  name: string;
  dataType: string;
}
interface IEvent {
  key: string;
  name: string;
  payload: IPayload[];
}
interface IAction {
  key: string;
  name: string;
  params: IPayload[];
}
interface IComponentConfig {
  events: IEvent[];
  actions: IAction[];
}
interface IEventCenter {
  triggerEvent: (
    id: string,
    type: string,
    value: { [key: string]: any }
  ) => void;
}
interface IComponentCenter {
  register: (
    id: string,
    comp: string,
    instance: IInstanceActions,
    eventCenter: IComponentConfig
  ) => void;
}
interface IInstanceActions {
  Event_Center_getName: () => string;
  [do_EventCenter_: string]: (...params: any[]) => any;
}
declare interface Window {
  CUSTOM_PLUGIN: Map;
  _: functions;
  componentCenter: IComponentCenter;
  eventCenter: IEventCenter;
  token: string;
  JSEncrypt: Class;
}
