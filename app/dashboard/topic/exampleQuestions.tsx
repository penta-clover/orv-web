export default function ExampleQuestions(props: { questions: string[] }) {
  return (
    <div className="flex flex-row gap-[9px]">
      <div className="w-[2px] h-[54px] rounded bg-grayscale-600" />
      <div>
        {props.questions.map((question: string, index: number) => {
          return (
            <div key={index} className="text-body2 text-grayscale-100">
              {question}
            </div>
          );
        })}
      </div>
    </div>
  );
}
