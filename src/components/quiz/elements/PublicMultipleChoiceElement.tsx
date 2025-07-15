import { MultipleChoiceElementContent, AnswerValue } from "@/types/composed";
import { useQuizResponseStore } from "@/stores/useQuizResponseStore";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PublicMultipleChoiceElementProps {
  content: MultipleChoiceElementContent;
  elementId: string;
}

export function PublicMultipleChoiceElement({
  content,
  elementId,
}: PublicMultipleChoiceElementProps) {
  const { setResponse, getResponse } = useQuizResponseStore();
  const currentResponse = getResponse(elementId);

  const handleSingleChoice = (value: string) => {
    const answerValue: AnswerValue = {
      multipleChoice: value,
      selectedOptions: [value],
    };
    setResponse(elementId, answerValue);
  };

  const handleMultipleChoice = (optionValue: string, checked: boolean) => {
    const current = currentResponse?.selectedOptions || [];
    const newSelection = checked
      ? [...current, optionValue]
      : current.filter((v) => v !== optionValue);

    const answerValue: AnswerValue = {
      multipleChoice: newSelection,
      selectedOptions: newSelection,
    };
    setResponse(elementId, answerValue);
  };

  const isOptionSelected = (optionValue: string): boolean => {
    if (!currentResponse) return false;

    if (content.allowMultiple) {
      return currentResponse.selectedOptions?.includes(optionValue) || false;
    } else {
      return currentResponse.multipleChoice === optionValue;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium leading-relaxed">
          {content.question}
          {content.required && <span className="text-destructive ml-1">*</span>}
        </h3>
      </div>

      <div className="max-w-md mx-auto">
        {content.allowMultiple ? (
          <div className="space-y-3">
            {content.options.map((option) => (
              <Card
                key={option.id}
                className={`
                  p-4 cursor-pointer transition-all duration-200 
                  hover:shadow-md hover:border-primary/50
                  ${
                    isOptionSelected(option.value)
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border"
                  }
                `}
                onClick={() =>
                  handleMultipleChoice(
                    option.value,
                    !isOptionSelected(option.value)
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    id={`${elementId}-${option.id}`}
                    checked={isOptionSelected(option.value)}
                    onChange={() => {}} // Controlled by card click
                    aria-describedby={`${elementId}-${option.id}-label`}
                  />
                  <Label
                    htmlFor={`${elementId}-${option.id}`}
                    id={`${elementId}-${option.id}-label`}
                    className="flex-1 cursor-pointer text-sm font-medium"
                  >
                    {option.text}
                  </Label>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <RadioGroup
            value={(currentResponse?.multipleChoice as string) || ""}
            onValueChange={handleSingleChoice}
            className="space-y-3"
          >
            {content.options.map((option) => (
              <Card
                key={option.id}
                className={`
                  p-4 cursor-pointer transition-all duration-200 
                  hover:shadow-md hover:border-primary/50
                  ${
                    isOptionSelected(option.value)
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border"
                  }
                `}
                onClick={() => handleSingleChoice(option.value)}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value={option.value}
                    id={`${elementId}-${option.id}`}
                    aria-describedby={`${elementId}-${option.id}-label`}
                  />
                  <Label
                    htmlFor={`${elementId}-${option.id}`}
                    id={`${elementId}-${option.id}-label`}
                    className="flex-1 cursor-pointer text-sm font-medium"
                  >
                    {option.text}
                  </Label>
                </div>
              </Card>
            ))}
          </RadioGroup>
        )}
      </div>

      {content.required && (
        <p className="text-xs text-muted-foreground text-center">
          * Campo obrigatório
        </p>
      )}
    </div>
  );
}
