import { getQuizById } from "@/lib/actions/quiz-actions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quiz = await getQuizById(id);

    if (!quiz.success) {
      return NextResponse.json(
        { success: false, error: quiz.error || "Quiz not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Quiz fetched successfully",
      quizId: id,
      data: quiz.data,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
