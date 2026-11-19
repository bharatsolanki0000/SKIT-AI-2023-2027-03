import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExtensionLaunchPage from './ExtensionLaunchPage';
import { extensionLaunchService, EXTENSION_STATUS } from './extensionLaunchService';

describe('CAMBER Study Launch & Chrome Extension Setup Page Suite', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    delete window.camberExtension;
    delete window.__CAMBER_EXTENSION_INSTALLED__;
    if (document.documentElement) {
      delete document.documentElement.dataset.camberExtension;
      delete document.documentElement.dataset.camberInstalled;
    }
  });

  test('SCREEN & HEADER: renders page header with brand, paw icon and handwritten motivational note', () => {
    render(<ExtensionLaunchPage onNavigate={mockNavigate} />);

    // Brand wordmark
    expect(screen.getAllByText('CAMBER')[0]).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /CAMBER Dashboard Home/i })).toBeInTheDocument();

    // Handwritten motivational note
    expect(screen.getByText(/Small steps/i)).toBeInTheDocument();
    expect(screen.getByText(/Big progress/i)).toBeInTheDocument();
  });

  test('CARD 1: renders "Let\'s get your study space ready!" with heading, text, mascot and buddy note', () => {
    render(<ExtensionLaunchPage onNavigate={mockNavigate} />);

    // Heading
    expect(
      screen.getByRole('heading', { level: 2, name: /Let's get your\s*study space ready!/i })
    ).toBeInTheDocument();

    // Supporting text
    expect(
      screen.getByText(/CAMBER works alongside your study material to understand your learning experience/i)
    ).toBeInTheDocument();

    // Mascot
    expect(
      screen.getByAltText(/Camber squirrel mascot holding a green study book happily/i)
    ).toBeInTheDocument();

    // Handwritten buddy note
    expect(screen.getByText(/Your learning buddy/i)).toBeInTheDocument();
  });

  test('CARD 2: renders "Why do I need the extension?" with exactly 3 informational benefit boxes', () => {
    render(<ExtensionLaunchPage onNavigate={mockNavigate} />);

    // Heading
    expect(
      screen.getByRole('heading', { level: 2, name: /Why do I need\s*the extension\?/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/The CAMBER Chrome Extension helps us:/i)
    ).toBeInTheDocument();

    // Box 1
    expect(
      screen.getByRole('heading', { level: 3, name: /Identify your study\s*material/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Detects whether you're reading a PDF in Chrome\./i)
    ).toBeInTheDocument();

    // Box 2
    expect(
      screen.getByRole('heading', { level: 3, name: /Support your\s*study session/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Reads the content \(like text, captions or key points\) to understand what you're learning\./i)
    ).toBeInTheDocument();

    // Box 3
    expect(
      screen.getByRole('heading', { level: 3, name: /Provide personalized\s*learning assistance/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Offers explanations, quizzes, breaks and motivation based on your learning state\./i)
    ).toBeInTheDocument();
  });

  test('CARD 3: renders setup steps, Add to Chrome button, connection popup replica and PDF instructions', () => {
    render(<ExtensionLaunchPage onNavigate={mockNavigate} />);

    // Card 3 Heading & handwritten note
    expect(
      screen.getByRole('heading', { level: 2, name: /Install & Connect\s*your Extension/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/You're just/i)).toBeInTheDocument();
    expect(screen.getByText(/a few steps away!/i)).toBeInTheDocument();

    // Area 1: Install Chrome Extension
    expect(
      screen.getByRole('heading', { level: 3, name: /Install the Chrome Extension/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Click on the button below to add CAMBER to your Chrome browser\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Add CAMBER Extension to Google Chrome/i })
    ).toBeInTheDocument();

    // Area 2: Connect with CAMBER
    expect(
      screen.getByRole('heading', { level: 3, name: /Connect with CAMBER/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Once installed, click on the extension icon and sign in with your CAMBER account\./i)
    ).toBeInTheDocument();

    // Mini popup replica with honest default status
    expect(screen.getByText(/Not connected/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Check$/i })).toBeInTheDocument();

    // Area 3: Study Material (PDF only)
    expect(
      screen.getByRole('heading', { level: 3, name: /Now, open your study material/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/PDF only/i)).toBeInTheDocument();
    expect(
      screen.getByText(/For now, you can use a PDF\. Open it in Google Chrome, keep it in your browser and hit Start Studying\./i)
    ).toBeInTheDocument();

    // Bottom Start Studying Banner
    expect(
      screen.getByRole('heading', { level: 3, name: /Start studying\.\.\./i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/CAMBER has got your back! ♥/i)
    ).toBeInTheDocument();
  });

  test('INTERACTION: Add to Chrome shows friendly configuration notice if URL unconfigured', () => {
    render(<ExtensionLaunchPage onNavigate={mockNavigate} />);

    const addBtn = screen.getByRole('button', { name: /Add CAMBER Extension to Google Chrome/i });
    fireEvent.click(addBtn);

    expect(
      screen.getByText(/The extension installation link hasn't been configured yet\./i)
    ).toBeInTheDocument();
  });

  test('INTERACTION: Check Connection performs truthful check and updates feedback', async () => {
    render(<ExtensionLaunchPage onNavigate={mockNavigate} />);

    const checkBtn = screen.getByRole('button', { name: /^Check$/i });
    fireEvent.click(checkBtn);

    // Shows checking status momentarily
    expect(screen.getByText(/Connecting\.\.\./i)).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText(/Extension not detected yet\. Open the extension in Chrome and try checking again\./i)
      ).toBeInTheDocument();
    }, { timeout: 1500 });
  });

  test('INTERACTION: Start Studying checks connection and displays friendly warning when not connected', () => {
    render(<ExtensionLaunchPage onNavigate={mockNavigate} />);

    const startBanner = screen.getByRole('button', { name: /Start studying with CAMBER/i });
    fireEvent.click(startBanner);

    // Warm, encouraging feedback message as requested in prompt Section 11
    expect(
      screen.getByText(/Almost there! Let's connect your CAMBER extension first\. ♡/i)
    ).toBeInTheDocument();
  });

  test('INTERACTION: Start Studying proceeds when extension connection is detected', async () => {
    jest.spyOn(extensionLaunchService, 'checkConnection').mockResolvedValue(EXTENSION_STATUS.CONNECTED);

    render(<ExtensionLaunchPage onNavigate={mockNavigate} />);

    // Trigger check to set connected state
    const checkBtn = screen.getByRole('button', { name: /^Check$/i });
    fireEvent.click(checkBtn);

    await waitFor(() => {
      expect(screen.getByText(/Connected/i)).toBeInTheDocument();
    });

    const startBanner = screen.getByRole('button', { name: /Start studying with CAMBER/i });
    fireEvent.click(startBanner);

    expect(
      screen.getByText(/You're all set! Starting your study session\.\.\. ♡/i)
    ).toBeInTheDocument();
  });

  test('NAVIGATION: clicking brand in header returns to dashboard', () => {
    render(<ExtensionLaunchPage onNavigate={mockNavigate} />);

    const brandBtn = screen.getByRole('button', { name: /CAMBER Dashboard Home/i });
    fireEvent.click(brandBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
