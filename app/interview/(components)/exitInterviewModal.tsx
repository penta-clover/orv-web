import Modal from "../../components/modal";

export default function ExitInterviewModal(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onExitInterview: () => void;
  children: React.ReactNode;
}) {
  const { isOpen, setIsOpen, onExitInterview, children } = props;

  return (
    <Modal
      title="인터뷰를 종료하시겠어요?"
      description="인터뷰를 종료하면 지금까지 진행된 내용이 모두 삭제됩니다.\n정말 종료하시겠어요?"
      confirmButtonText="네, 종료할게요"
      cancelButtonText="인터뷰로 돌아갈게요"
      onConfirm={onExitInterview}
      onCancel={() => setIsOpen(false)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      {children}
    </Modal>
  );
}
