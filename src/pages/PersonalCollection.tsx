import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List, Plus, Search, Tag } from "lucide-react";

export default function PersonalCollection() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-shop-800">Personal Collection</h1>
            <p className="text-muted-foreground mt-1">
              Showcase and organize your most prized collectibles
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add to Collection
          </Button>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input className="pl-10" placeholder="Search your collection..." />
          </div>
          <Button variant="outline">
            <Tag className="w-4 h-4 mr-2" />
            Manage Tags
          </Button>
        </div>

        <Tabs defaultValue="grid">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="grid">
                <Grid className="w-4 h-4 mr-2" />
                Grid View
              </TabsTrigger>
              <TabsTrigger value="list">
                <List className="w-4 h-4 mr-2" />
                List View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vintage Comic Book</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src="/placeholder.svg"
                    alt="Collection Item"
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <p className="text-sm text-muted-foreground">
                    First edition, mint condition. Added to collection on March 10, 2024
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="secondary" size="sm">
                      Edit Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {/* List view items would go here */}
                  <div className="p-4 flex items-center gap-4">
                    <img
                      src="/placeholder.svg"
                      alt="Collection Item"
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">Vintage Comic Book</h3>
                      <p className="text-sm text-muted-foreground">
                        Added on March 10, 2024
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}