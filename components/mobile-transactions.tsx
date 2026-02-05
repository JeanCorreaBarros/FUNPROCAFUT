"use client"

import { ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function MobileTransactions() {
  const transactions = [
    {
      id: 1,
      name: "Ada Femi",
      type: "sent",
      amount: "$1,923",
      originalAmount: "$12945",
      date: "Nov 12",
      description: "Sent by you",
    },
    {
      id: 2,
      name: "Musa Adebayor",
      type: "received",
      amount: "$1,532",
      originalAmount: "$14922",
      date: "Nov 14",
      description: "Received by you",
    },
    {
      id: 3,
      name: "Nneka Malik",
      type: "sent",
      amount: "$950",
      originalAmount: "$12945",
      date: "Nov 12",
      description: "Sent by you",
    },
    {
      id: 4,
      name: "Tunde Ugo",
      type: "sent",
      amount: "$190",
      originalAmount: "$12945",
      date: "May 26",
      description: "Sent by you",
    },
  ]

  return (
    <Card className="bg-white border-0 shadow-sm mb-20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Transactions</CardTitle>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
            see all
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === "sent" ? "bg-red-50" : "bg-green-50"
              }`}
            >
              {transaction.type === "sent" ? (
                <ArrowUp size={16} className="text-red-600" />
              ) : (
                <ArrowDown size={16} className="text-green-600" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900 truncate">{transaction.name}</h3>
                <span className="font-semibold text-gray-900">{transaction.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 truncate">
                  {transaction.description} • {transaction.date}
                </p>
                <span className="text-sm text-gray-400">{transaction.originalAmount}</span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
