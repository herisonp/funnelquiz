import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Funnel Quiz</CardTitle>
          <CardDescription>Sistema configurado com sucesso!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Teste do input" />
          <Button className="w-full">Teste do botão</Button>
        </CardContent>
      </Card>
    </div>
  );
}
