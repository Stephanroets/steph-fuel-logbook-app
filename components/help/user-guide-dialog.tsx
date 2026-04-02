"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, Car, Fuel, BarChart3, FileDown, Lock, Camera } from "lucide-react"

interface UserGuideDialogProps {
  children?: React.ReactNode
}

export function UserGuideDialog({ children }: UserGuideDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help Guide
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[85vh] w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl">FuelLog User Guide</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Everything you need to know about tracking your vehicle&apos;s fuel consumption
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(85vh-120px)] pr-2 sm:pr-4">
          <Tabs defaultValue="getting-started" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto gap-1 p-1">
              <TabsTrigger value="getting-started" className="text-xs sm:text-sm px-2 py-2">Getting Started</TabsTrigger>
              <TabsTrigger value="vehicles" className="text-xs sm:text-sm px-2 py-2">Vehicles</TabsTrigger>
              <TabsTrigger value="fuel-logs" className="text-xs sm:text-sm px-2 py-2">Fuel Logs</TabsTrigger>
              <TabsTrigger value="features" className="text-xs sm:text-sm px-2 py-2">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="getting-started" className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              <div className="rounded-lg border p-3 sm:p-6 bg-muted/50">
                <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  Welcome to FuelLog!
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  FuelLog helps you track your vehicle&apos;s fuel consumption, manage expenses, and keep records for tax purposes. This guide will walk you through everything step-by-step.
                </p>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step-1">
                  <AccordionTrigger className="text-base font-semibold">
                    Step 1: Add Your First Vehicle
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p>After logging in, you&apos;ll see your Dashboard. Here&apos;s how to add your first vehicle:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Look for the <strong>&quot;Add Vehicle&quot;</strong> button on your Dashboard</li>
                      <li>Click the button - a form will appear</li>
                      <li>Fill in your vehicle details:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li><strong>Make:</strong> The manufacturer (e.g., Toyota, Ford, BMW)</li>
                          <li><strong>Model:</strong> The model name (e.g., Corolla, Ranger, 3 Series)</li>
                          <li><strong>Year:</strong> The year your vehicle was made</li>
                          <li><strong>Registration Number:</strong> Your license plate (e.g., ABC123GP)</li>
                        </ul>
                      </li>
                      <li>Click <strong>&quot;Add Vehicle&quot;</strong> to save</li>
                    </ol>
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100">💡 Tip: You can add multiple vehicles if you have more than one car!</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-2">
                  <AccordionTrigger className="text-base font-semibold">
                    Step 2: Record Your First Fuel Entry
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p>Once you&apos;ve added a vehicle, you can start tracking fuel purchases:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Click on your vehicle card to open the vehicle details page</li>
                      <li>Click the <strong>&quot;Add Fuel Entry&quot;</strong> button</li>
                      <li>Fill in the fuel purchase information:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li><strong>Date:</strong> When you filled up (defaults to today)</li>
                          <li><strong>Odometer Reading:</strong> The total kilometers shown on your car&apos;s dashboard</li>
                          <li><strong>Liters:</strong> How many liters of fuel you purchased</li>
                          <li><strong>Price per Liter:</strong> The cost per liter in Rands (e.g., R22.50)</li>
                          <li><strong>Petrol Station:</strong> (Optional) Where you filled up (e.g., Shell, Engen)</li>
                        </ul>
                      </li>
                      <li>The total cost will be calculated automatically</li>
                      <li>Click <strong>&quot;Add Entry&quot;</strong> to save</li>
                    </ol>
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-green-900 dark:text-green-100">✅ Important: Always record your odometer reading accurately - this is how the app calculates your fuel efficiency!</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step-3">
                  <AccordionTrigger className="text-base font-semibold">
                    Step 3: Understanding Your Fuel Efficiency
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p>After adding at least 2 fuel entries, FuelLog will automatically calculate your fuel consumption:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li><strong>km/L (Kilometers per Liter):</strong> Shows how many kilometers you can drive with 1 liter of fuel</li>
                      <li><strong>Higher is better:</strong> More km/L means better fuel efficiency</li>
                      <li><strong>Tank-to-tank calculation:</strong> The app calculates consumption between fill-ups</li>
                    </ul>
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100">📊 Example: If you drove 500km and used 50 liters, your consumption is 10 km/L</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="vehicles" className="space-y-4 mt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="add-vehicle">
                  <AccordionTrigger className="text-base font-semibold">
                    How to Add a Vehicle
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Go to your Dashboard (click &quot;FuelLog&quot; logo at the top)</li>
                      <li>Click the <strong>&quot;Add Vehicle&quot;</strong> button</li>
                      <li>Enter vehicle information:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li>Make (manufacturer name)</li>
                          <li>Model (vehicle model)</li>
                          <li>Year (manufacturing year)</li>
                          <li>Registration Number (license plate)</li>
                        </ul>
                      </li>
                      <li>Click <strong>&quot;Add Vehicle&quot;</strong></li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="view-vehicle">
                  <AccordionTrigger className="text-base font-semibold">
                    How to View Vehicle Details
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>From your Dashboard, you&apos;ll see all your vehicles displayed as cards</li>
                      <li>Each card shows:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li>Vehicle make, model, and year</li>
                          <li>Registration number</li>
                          <li>Number of fuel entries recorded</li>
                        </ul>
                      </li>
                      <li>Click on any vehicle card to see full details and fuel history</li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="edit-vehicle">
                  <AccordionTrigger className="text-base font-semibold">
                    How to Edit or Delete a Vehicle
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p><strong>To Edit:</strong></p>
                    <ol className="list-decimal list-inside space-y-2 ml-2 mb-4">
                      <li>Click on the vehicle card to open details</li>
                      <li>Look for the edit button (usually a pencil icon)</li>
                      <li>Update the information you want to change</li>
                      <li>Click <strong>&quot;Save&quot;</strong></li>
                    </ol>
                    <p><strong>To Delete:</strong></p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Click on the vehicle card</li>
                      <li>Look for the delete button (usually a trash icon)</li>
                      <li>Confirm you want to delete the vehicle</li>
                    </ol>
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-red-900 dark:text-red-100">⚠️ Warning: Deleting a vehicle will also delete all its fuel entries. This cannot be undone!</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="fuel-logs" className="space-y-4 mt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="add-entry">
                  <AccordionTrigger className="text-base font-semibold">
                    <Fuel className="h-4 w-4 mr-2" />
                    How to Add a Fuel Entry
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p className="mb-3">Record every time you fill up your tank:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Click on your vehicle to open its details page</li>
                      <li>Click <strong>&quot;Add Fuel Entry&quot;</strong></li>
                      <li>Fill in the required information:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li><strong>Date:</strong> When you filled up</li>
                          <li><strong>Odometer Reading:</strong> Current km on your dashboard</li>
                          <li><strong>Liters:</strong> Amount of fuel purchased</li>
                          <li><strong>Price per Liter:</strong> Cost per liter in Rands</li>
                        </ul>
                      </li>
                      <li>Optional information:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li>Petrol station name</li>
                          <li>Receipt photo (see next section)</li>
                          <li>Work travel details (for tax purposes)</li>
                        </ul>
                      </li>
                      <li>Click <strong>&quot;Add Entry&quot;</strong></li>
                    </ol>
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100">💡 Best Practice: Add entries right after filling up while the information is fresh!</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="upload-receipt">
                  <AccordionTrigger className="text-base font-semibold">
                    <Camera className="h-4 w-4 mr-2" />
                    How to Upload Receipt Photos
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p>Keep digital copies of your fuel receipts for record-keeping:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>When adding or editing a fuel entry, look for the <strong>&quot;Receipt&quot;</strong> section</li>
                      <li>Click <strong>&quot;Choose File&quot;</strong> or tap the upload area</li>
                      <li>Select a photo from your device:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li>Take a photo with your phone camera</li>
                          <li>Or select an existing image</li>
                        </ul>
                      </li>
                      <li>You&apos;ll see a preview of the receipt</li>
                      <li>Click <strong>&quot;Add Entry&quot;</strong> to save with the receipt</li>
                    </ol>
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-green-900 dark:text-green-100">📸 Tip: Make sure the receipt is clear and readable. The image will be automatically optimized and stored securely.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="work-travel">
                  <AccordionTrigger className="text-base font-semibold">
                    <Lock className="h-4 w-4 mr-2" />
                    Tracking Work Travel for SARS
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p>If you use your vehicle for work, you can track business travel for tax deductions:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>When adding a fuel entry, find the checkbox: <strong>&quot;This is work travel (for SARS)&quot;</strong></li>
                      <li>Tick the checkbox if this fuel was used for work purposes</li>
                      <li>Enter the <strong>&quot;Work Travel Distance&quot;</strong> in kilometers</li>
                      <li>This information will be included in your exported reports</li>
                    </ol>
                    <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-yellow-900 dark:text-yellow-100">📋 SARS Compliance: Keep accurate records of work-related travel. You can export these records for your tax returns.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="edit-entry">
                  <AccordionTrigger className="text-base font-semibold">
                    How to Edit or Delete a Fuel Entry
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p><strong>To Edit an Entry:</strong></p>
                    <ol className="list-decimal list-inside space-y-2 ml-2 mb-4">
                      <li>Go to your vehicle&apos;s details page</li>
                      <li>Find the fuel entry you want to edit in the list</li>
                      <li>Click the edit button (pencil icon)</li>
                      <li>Update the information</li>
                      <li>Click <strong>&quot;Save Changes&quot;</strong></li>
                    </ol>
                    <p><strong>To Delete an Entry:</strong></p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Find the entry in the list</li>
                      <li>Click the delete button (trash icon)</li>
                      <li>Confirm you want to delete it</li>
                    </ol>
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100">💡 Note: Some entries may be &quot;locked&quot; if they&apos;ve been exported for tax purposes. This prevents accidental changes to official records.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            <TabsContent value="features" className="space-y-4 mt-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="analytics">
                  <AccordionTrigger className="text-base font-semibold">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Understanding Your Analytics
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p>FuelLog automatically calculates important statistics for you:</p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li><strong>Average Fuel Consumption (km/L):</strong> How efficiently your vehicle uses fuel
                        <ul className="list-disc list-inside ml-6 mt-1 text-xs">
                          <li>Higher numbers = better efficiency</li>
                          <li>Calculated from all your fuel entries</li>
                        </ul>
                      </li>
                      <li><strong>Total Distance Traveled:</strong> Total kilometers driven since you started tracking</li>
                      <li><strong>Total Fuel Used:</strong> Total liters of fuel purchased</li>
                      <li><strong>Total Cost:</strong> Total amount spent on fuel in Rands</li>
                      <li><strong>Average Cost per Kilometer:</strong> How much it costs to drive 1 km</li>
                    </ul>
                    <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-purple-900 dark:text-purple-100">📈 Tip: Check your analytics regularly to spot trends. A sudden drop in efficiency might indicate a problem with your vehicle!</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="export">
                  <AccordionTrigger className="text-base font-semibold">
                    <FileDown className="h-4 w-4 mr-2" />
                    How to Export Your Fuel Logbook
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p>Export your fuel records for tax purposes or personal records:</p>
                    <ol className="list-decimal list-inside space-y-2 ml-2">
                      <li>Go to your vehicle&apos;s details page</li>
                      <li>Click the <strong>&quot;Export&quot;</strong> button at the top</li>
                      <li>Choose your export options:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li>Date range (e.g., last year for tax season)</li>
                          <li>Include work travel only (for SARS)</li>
                          <li>Include receipt images</li>
                        </ul>
                      </li>
                      <li>Select format (PDF or Excel)</li>
                      <li>Click <strong>&quot;Export&quot;</strong> to download</li>
                    </ol>
                    <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-green-900 dark:text-green-100">💼 Tax Season: Export your work travel records at the end of the tax year to submit with your SARS returns!</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="currency">
                  <AccordionTrigger className="text-base font-semibold">
                    Understanding South African Rand (ZAR)
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <p>All prices in FuelLog are in South African Rand (ZAR):</p>
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li>Currency symbol: <strong>R</strong></li>
                      <li>Example: R22.50 per liter</li>
                      <li>Enter prices as you see them at the pump</li>
                      <li>The app will calculate totals automatically</li>
                    </ul>
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-3 mt-3">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100">💰 Example: If fuel costs R23.45 per liter and you buy 50 liters, the total will be R1,172.50</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tips">
                  <AccordionTrigger className="text-base font-semibold">
                    Tips for Best Results
                  </AccordionTrigger>
                  <AccordionContent className="space-y-3 text-sm">
                    <ul className="list-disc list-inside space-y-2 ml-2">
                      <li><strong>Fill up completely:</strong> For accurate consumption calculations, always fill your tank to full</li>
                      <li><strong>Record immediately:</strong> Add entries right after filling up so you don&apos;t forget details</li>
                      <li><strong>Check odometer carefully:</strong> Double-check your odometer reading - this is crucial for accuracy</li>
                      <li><strong>Keep receipts:</strong> Upload receipt photos for complete records</li>
                      <li><strong>Track work travel:</strong> Mark work-related fuel purchases for tax deductions</li>
                      <li><strong>Regular monitoring:</strong> Check your analytics monthly to spot unusual consumption patterns</li>
                      <li><strong>Export regularly:</strong> Download your records periodically as backup</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="troubleshooting">
                  <AccordionTrigger className="text-base font-semibold">
                    Common Questions & Troubleshooting
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 text-sm">
                    <div>
                      <p className="font-semibold mb-1">Q: Why isn&apos;t my fuel consumption showing?</p>
                      <p className="text-muted-foreground">A: You need at least 2 fuel entries before consumption can be calculated. The app calculates consumption between fill-ups.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Q: Can I edit an entry after adding it?</p>
                      <p className="text-muted-foreground">A: Yes! Click the edit button on any entry. However, entries that have been locked (exported for tax) cannot be edited to maintain record integrity.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Q: What if I forgot to record a fill-up?</p>
                      <p className="text-muted-foreground">A: You can add entries with past dates. Just select the correct date when adding the entry.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Q: How do I track multiple vehicles?</p>
                      <p className="text-muted-foreground">A: Simply add each vehicle separately from your Dashboard. Each vehicle has its own fuel log and analytics.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Q: Is my data safe?</p>
                      <p className="text-muted-foreground">A: Yes! All your data is securely stored and encrypted. Receipt images are stored in secure cloud storage.</p>
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Q: Can I access FuelLog on my phone?</p>
                      <p className="text-muted-foreground">A: Yes! FuelLog works on any device - computer, tablet, or smartphone. Just log in with your account.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
