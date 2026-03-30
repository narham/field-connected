import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SSBAttendance from "../pages/ssb/SSBAttendance";
import { describe, it, expect, vi } from "vitest";

// Mock supabase
vi.mock("@/lib/supabase", () => ({
  supabase: {
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockResolvedValue({ data: [], error: null }),
    upsert: vi.fn().mockResolvedValue({ error: null }),
  },
}));

describe("SSBAttendance Module", () => {
  it("renders loading state initially", () => {
    render(
      <BrowserRouter>
        <SSBAttendance />
      </BrowserRouter>
    );
    expect(screen.getByText(/Memuat data pemain/i)).toBeInTheDocument();
  });
});
