
export const GET = async () => {
  return NextResponse.json({ message: "Hello World" });
};

export function POST() {
  return NextResponse.json({ message: "Hello World" });
}
