import { useRef, useEffect } from "react";

function useDelegator(
  id,
  actions,
  eventActionDefine,
  objectId,
  child_id,
  index,
  { eventCenter, componentCenter }
) {
  let ref = useRef(actions);
  useEffect(() => {
    let initId = id;
    if (child_id) {
      initId = `${initId}_childtable`;
    }
    if (index > -1) {
      initId = `${initId}_${index}`;
    }
    componentCenter.register(initId, "comp", ref.current, eventActionDefine);
    return () => {
      componentCenter.removeInstance(initId);
    };
  }, [id, actions, eventActionDefine, child_id, index, componentCenter]);
}

export default useDelegator;
