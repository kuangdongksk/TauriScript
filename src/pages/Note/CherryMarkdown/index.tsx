import "cherry-markdown/dist/cherry-markdown.css";
import Cherry from "cherry-markdown";
import { useEffect, useRef } from "react";

export interface ICherryMarkdownProps {}

function CherryMarkdown(props: ICherryMarkdownProps) {
  const {} = props;

  const cherryRef = useRef<Cherry>(null);

  useEffect(() => {
    cherryRef.current = new Cherry({
      id: "CherryMarkdown-container",
      value: "# welcome to cherry editor!",
    });
    return () => {
      cherryRef.current?.destroy();
    };
  }, []);

  return (
    <>
      <div id="CherryMarkdown-container"></div>
    </>
  );
}
export default CherryMarkdown;
