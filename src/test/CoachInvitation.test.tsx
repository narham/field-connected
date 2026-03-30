import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SSBCoachManagement from "../pages/ssb/SSBCoachManagement";
import { BrowserRouter } from "react-router-dom";
import { supabase } from "../lib/supabase";

// Mock Supabase
vi.mock("../lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(() => Promise.resolve({ data: { session: { user: { id: "admin-123" } } } })),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: vi.fn(() => Promise.resolve({ data: {}, error: null })),
    })),
    functions: {
      invoke: vi.fn(() => Promise.resolve({ data: { success: true, message: "Invited" }, error: null })),
    },
  },
}));

describe("SSBCoachManagement - Coach Invitation Flow", () => {
  it("renders the management page correctly", async () => {
    render(
      <BrowserRouter>
        <SSBCoachManagement />
      </BrowserRouter>
    );
    expect(screen.getByText("Manajemen Pelatih")).toBeDefined();
    expect(screen.getByText("Daftar Coach")).toBeDefined();
  });

  it("opens the registration dialog when clicking 'Daftar Coach'", async () => {
    render(
      <BrowserRouter>
        <SSBCoachManagement />
      </BrowserRouter>
    );
    const registerBtn = screen.getByText("Daftar Coach");
    fireEvent.click(registerBtn);
    expect(screen.getByText("Daftarkan Pelatih Baru")).toBeDefined();
  });

  it("validates the form correctly", async () => {
    render(
      <BrowserRouter>
        <SSBCoachManagement />
      </BrowserRouter>
    );
    fireEvent.click(screen.getByText("Daftar Coach"));
    
    const submitBtn = screen.getByText("Kirim Undangan & Daftar");
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Nama minimal 3 karakter")).toBeDefined();
      expect(screen.getByText("Format email tidak valid")).toBeDefined();
    });
  });
});
