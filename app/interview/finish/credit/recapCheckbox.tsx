export default function RecapCheckbox({ onChange }: { onChange: (checked: boolean) => void }) {
    return (
      <div className="h-[132px] w-[402px]">
        <div className="text-body1 text-grayscale-white text-center">
          일주일 뒤, 오늘 진행한 인터뷰 Recap을 보내드려요.
          <br />
          인터뷰 Recap을 원하지 않으신다면 체크를 풀어주세요.
        </div>
  
        <div className="h-[14px]" />
  
        <label htmlFor="recap-checkbox" className="flex justify-center items-center gap-[11px]">
          <input
            id="recap-checkbox"
            type="checkbox"
            defaultChecked
            className="w-[22px] h-[22px] rounded-[5.5px] bg-[url('/icons/checkbox-unchecked.svg')] checked:bg-[url('/icons/checkbox-checked.svg')] transition-all"
            onChange={(e) => {
              onChange(e.target.checked);
            }}
          />
          <span className="text-body1 text-grayscale-white">
            좋아요, 받고 싶어요.
          </span>
        </label>
      </div>
    );
  }
  