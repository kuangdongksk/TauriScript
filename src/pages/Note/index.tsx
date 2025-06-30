import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface INoteEditorProps {}

function NoteEditor(props: INoteEditorProps) {
  const {} = props;
  return (
    <Card className="h-full overflow-auto">
      <CardContent>
        <Card>
          <CardHeader>
            <CardTitle>Vditor</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>MilkDown</CardTitle>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
export default NoteEditor;
