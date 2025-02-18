const GENDERS = {
  "남성": "MALE",
  "여성": "FEMALE"
};
export type Gender = typeof GENDERS[keyof typeof GENDERS];

export type JoinStep2Props = {
  birthYear: number | null,
  birthMonth: number | null,
  birthDay: number | null,
  gender: Gender | null,
  nickname: string,
  onNextClicked: () => void,
  onBirthYearChanged: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  onBirthMonthChanged: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  onBirthDayChanged: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  onGenderChanged: (e: React.ChangeEvent<HTMLSelectElement>) => void,
};

export default function JoinStep2Presentation({birthYear, birthMonth, birthDay, gender, nickname, onNextClicked, onBirthYearChanged, onBirthMonthChanged, onBirthDayChanged, onGenderChanged}: JoinStep2Props) {
  const optionYears = new Array(200).fill(1900).map((v, i) => v+i);
  const optionMonths = new Array(12).fill(1).map((v, i) => v+i);
  const optionDays = new Array(31).fill(1).map((v, i) => v+i); // 이거 동적으로 바꿔야 할가욥..?

  return (
    <div className="flex flex-col max-w-[450px] h-screen mx-auto py-10 px-5 space-y-4">
      <h1 className="text-2xl font-extrabold">
        {nickname}님에 대한 정보를 입력해주세요
      </h1>
      <div className="flex-1 w-full space-y-4">
        <select
          className="w-full p-2 text-sm bg-gray-100 rounded-md"
          defaultValue={gender ?? 0}
          onChange={onGenderChanged}
        >
          <option hidden>성별</option>
          {Object.entries(GENDERS).map(([key, value]) => <option value={value} key={value}>{key}</option>)}
        </select>
        <div className="flex flex-row w-full space-x-2">
          <select
            className="flex-grow p-2 text-sm bg-gray-100 rounded-md"
            defaultValue={birthYear ?? 0}
            onChange={onBirthYearChanged}
          >
            <option hidden>출생 연도</option>
            {optionYears.map((year) => <option value={year} key={year}>{year}</option>)}
          </select>
          <select
            className="flex-grow p-2 text-sm bg-gray-100 rounded-md"
            defaultValue={birthMonth ?? 0}
            onChange={onBirthMonthChanged}
          >
            <option hidden>월</option>
            {optionMonths.map((month) => <option value={month} key={month}>{month}</option>)}
          </select>
          <select
            className="flex-grow p-2 text-sm bg-gray-100 rounded-md"
            defaultValue={birthDay ?? 0}
            onChange={onBirthDayChanged}
          >
            <option hidden>일</option>
            {optionDays.map((day) => <option value={day} key={day}>{day}</option>)}
          </select>
        </div>
      </div>
      <button className="w-full py-2 bg-gray-300 rounded-md text-m" onClick={onNextClicked}>
        다음
      </button>
    </div>
  );
}
