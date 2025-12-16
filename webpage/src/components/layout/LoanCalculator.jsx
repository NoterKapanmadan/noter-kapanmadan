"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

export default function LoanCalculator({ vehiclePrice }) {
  const [downPayment, setDownPayment] = useState(0);
  const [interestRate, setInterestRate] = useState(3.5);
  const [months, setMonths] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // Initialize down payment to 20% of vehicle price
  useEffect(() => {
    if (vehiclePrice) {
      setDownPayment(Math.floor(vehiclePrice * 0.2));
    }
  }, [vehiclePrice]);

  useEffect(() => {
    calculateLoan();
  }, [downPayment, interestRate, months, vehiclePrice]);

  const calculateLoan = () => {
    if (!vehiclePrice) return;

    const principal = vehiclePrice - downPayment;
    const monthlyRate = interestRate / 100;
    
    // Simple Interest Formula for quick estimation (or standard amortization if preferred)
    // Amortization Formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
    
    let monthly = 0;
    if (monthlyRate === 0) {
      monthly = principal / months;
    } else {
      monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    }

    // If calculation fails (e.g. infinite), fallback
    if (!isFinite(monthly) || isNaN(monthly)) monthly = 0;

    const total = monthly * months;
    
    setMonthlyPayment(monthly);
    setTotalPayment(total + downPayment);
    setTotalInterest(total - principal);
  };

  const handleDownPaymentChange = (e) => {
    const val = Number(e.target.value);
    setDownPayment(val);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  };

  if (!vehiclePrice) return null;

  return (
    <Card className="mt-4 border-blue-100 shadow-md">
      <CardHeader className="bg-blue-50/50 pb-4">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calculator"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>
           Loan Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        
        <div className="space-y-2">
          <Label htmlFor="downPayment">Down Payment</Label>
          <div className="flex gap-2 items-center">
            <Input 
              id="downPayment" 
              type="number" 
              value={downPayment} 
              onChange={handleDownPaymentChange}
              max={vehiclePrice}
              min={0}
            />
          </div>
          <Slider 
            defaultValue={[20]} 
            max={vehiclePrice} 
            step={1000} 
            value={[downPayment]}
            onValueChange={(vals) => setDownPayment(vals[0])}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground text-right">{Math.round((downPayment / vehiclePrice) * 100)}% of Price</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="interestRate">Interest Rate (M)</Label>
            <div className="relative">
              <Input 
                id="interestRate" 
                type="number" 
                step="0.01" 
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="pr-6"
              />
              <span className="absolute right-2 top-2.5 text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="term">Term</Label>
            <Select value={months.toString()} onValueChange={(val) => setMonths(Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Months" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12 Months</SelectItem>
                <SelectItem value="24">24 Months</SelectItem>
                <SelectItem value="36">36 Months</SelectItem>
                <SelectItem value="48">48 Months</SelectItem>
                <SelectItem value="60">60 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 border-t space-y-3 bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Monthly Payment</span>
            <span className="text-lg font-bold text-blue-700">{formatCurrency(monthlyPayment)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Total Interest</span>
            <span className="text-slate-700">{formatCurrency(totalInterest)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Total Repayment</span>
            <span className="text-slate-700 font-medium">{formatCurrency(totalPayment)}</span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
