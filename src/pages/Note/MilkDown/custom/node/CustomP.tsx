import { useNodeViewContext } from "@prosemirror-adapter/react";

export interface ICustomPProps {}

function CustomP(props: ICustomPProps) {
  const {} = props;
  const { contentRef } = useNodeViewContext();

  return <p className="text-[20px]" ref={contentRef} />;
}
export default CustomP;
