"""輸入 A、B、C 與中獎率，依指定算式產生候選票號。

D = A + B + C
增量 = 中獎率 / 10
計算值 = D × (中獎率 + 增量 × N)，N = 1、2、3……
此算式不是經驗證的中獎預測方法。
"""

from decimal import Decimal, InvalidOperation
from math import ceil, floor


def parse_win_rate(value: str | Decimal) -> Decimal:
    """接受小數（0.3）或百分比（30%），回傳 0～1 的 Decimal。"""
    text = str(value).strip().replace("％", "%")
    is_percent = text.endswith("%")
    try:
        rate = Decimal(text[:-1].strip() if is_percent else text)
    except InvalidOperation as exc:
        raise ValueError("中獎率請輸入 0.3 或 30% 這類格式") from exc
    if not rate.is_finite():
        raise ValueError("中獎率必須是有限數值")
    if is_percent:
        rate /= Decimal("100")
    if not Decimal("0") <= rate <= Decimal("1"):
        raise ValueError("中獎率須介於 0～1，或 0%～100%")
    return rate


def generate_candidates(
    a: int,
    b: int,
    c: int,
    win_rate: str | Decimal = "0.30",
    count: int = 30,
    min_number: int | None = None,
    max_number: int | None = None,
) -> list[dict]:
    """計算 N=1～count；增量隨中獎率自動更新，取向下／向上整數。"""
    if any(type(value) is not int or value < 0 for value in (a, b, c)):
        raise ValueError("A、B、C 必須是非負整數")
    if type(count) is not int or count < 1:
        raise ValueError("count 必須是正整數")
    if min_number is not None and type(min_number) is not int:
        raise ValueError("min_number 必須是整數或 None")
    if max_number is not None and type(max_number) is not int:
        raise ValueError("max_number 必須是整數或 None")
    if min_number is not None and max_number is not None and min_number > max_number:
        raise ValueError("票號下限不能大於上限")

    total = a + b + c
    rate = parse_win_rate(win_rate)
    increment = rate / Decimal("10")

    rows = []
    for n in range(1, count + 1):
        coefficient = rate + increment * n
        value = Decimal(total) * coefficient
        numbers = [
            number
            for number in sorted({floor(value), ceil(value)})
            if (min_number is None or number >= min_number)
            and (max_number is None or number <= max_number)
        ]
        rows.append({
            "n": n,
            "coefficient": coefficient,
            "value": value,
            "candidates": numbers,
        })
    return rows


def read_integer(prompt: str, minimum: int = 0, default: int | None = None) -> int:
    while True:
        text = input(prompt).strip()
        if not text and default is not None:
            return default
        try:
            value = int(text)
        except ValueError:
            print("請輸入整數。")
            continue
        if value < minimum:
            print(f"請輸入大於或等於 {minimum} 的整數。")
            continue
        return value


def read_win_rate() -> Decimal:
    while True:
        try:
            return parse_win_rate(input("中獎率（例如 0.3 或 30%）："))
        except ValueError as exc:
            print(exc)


def main() -> None:
    print("依公式產生候選票號")
    a = read_integer("A（例如 03）：")
    b = read_integer("B（例如 43）：")
    c = read_integer("C（例如 91）：")
    rate = read_win_rate()
    count = read_integer("計算次數（直接按 Enter 為 30）：", minimum=1, default=30)

    # 確認實際票號範圍後，可填入整數；None 表示不篩選該邊界。
    min_number = None
    max_number = None

    total = a + b + c
    increment = rate / Decimal("10")
    rows = generate_candidates(
        a, b, c, win_rate=rate, count=count,
        min_number=min_number, max_number=max_number,
    )

    print(f"\nD = {a} + {b} + {c} = {total}")
    print(f"中獎率 = {rate:f}，增量 = {rate:f} / 10 = {increment:f}")
    print(f"公式：{total} × ({rate:f} + {increment:f} × N)\n")

    for row in rows:
        candidates = "、".join(map(str, row["candidates"])) or "超出票號範圍"
        print(
            f'N={row["n"]:02d}｜係數={row["coefficient"]:f}'
            f'｜計算值={row["value"]:f}｜候選票號={candidates}'
        )

    unique_numbers = sorted({number for row in rows for number in row["candidates"]})
    print("\n去除重複後的候選票號：")
    print("、".join(map(str, unique_numbers)) or "無符合範圍的票號")
    print("\n以上為公式計算結果，不能據此確認實際中獎票號。")


if __name__ == "__main__":
    try:
        main()
    except (EOFError, KeyboardInterrupt):
        print("\n已結束輸入。")
