import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { toast } from "sonner";
import { ScrollArea } from "../components/ui/scroll-area";

interface Theater {
  _id: string;
  name: string;
  location: string;
  seats: number;
}

const CreateTheater = () => {
  const [form, setForm] = useState({ name: "", location: "", seats: "" });
  const [loading, setLoading] = useState(false);
  const [theaters, setTheaters] = useState<Theater[]>([]);

  const fetchTheaters = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/theaters/gettheaters");
      setTheaters(res.data);
    } catch (error) {
      toast.error("Error fetching theaters");
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/theaters/createtheater", {
        ...form,
        seats: parseInt(form.seats),
      });
      toast.success("Theater created successfully!");
      setForm({ name: "", location: "", seats: "" });
      fetchTheaters(); // Refresh list
    } catch (error) {
      toast.error("Failed to create theater");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col lg:flex-row gap-6">
      {/* Form */}
      <Card className="w-full max-w-md mx-auto lg:mx-0">
        <CardHeader>
          <CardTitle>Create New Theater</CardTitle>
          <CardDescription>Fill the form to add a new theater</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Theater Name"
              required
            />
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              required
            />
            <Input
              type="number"
              name="seats"
              value={form.seats}
              onChange={handleChange}
              placeholder="Total Seats"
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Create Theater"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Theaters list */}
      <Card className="w-full lg:flex-1 shadow-md">
        <CardHeader>
          <CardTitle>All Theaters</CardTitle>
          <CardDescription>Manage your listed theaters</CardDescription>
        </CardHeader>
        <CardContent>
          {theaters.length === 0 ? (
            <p className="text-gray-500 text-sm">No theaters yet</p>
          ) : (
            <ScrollArea className="h-[400px] pr-2">
              <div className="space-y-3">
                {theaters.map((theater) => (
                  <Card
                    key={theater._id}
                    className="border border-gray-100 shadow-sm p-3"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-800">{theater.name}</p>
                        <p className="text-sm text-gray-500">{theater.location}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        Seats: {theater.seats}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTheater;
