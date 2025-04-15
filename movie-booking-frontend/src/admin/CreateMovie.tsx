import  { useState } from 'react';
import axios from 'axios';
import { Card ,CardContent} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Separator } from '../components/ui/separator';
import { ScrollArea } from '../components/ui/scroll-area';


const CreateMovie = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: '',
    language: '',
    genre: '',
    releaseDate: '',
    poster: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, poster: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('duration', form.duration);
    formData.append('language', form.language);
    formData.append('genre', form.genre);
    formData.append('releaseDate', form.releaseDate);
    formData.append('poster', form.poster);

    try {
      const response = await axios.post('http://localhost:5000/api/movies/create', formData);
      setMessage('✅ Movie created successfully!');
      setForm({
        title: '',
        description: '',
        duration: '',
        language: '',
        genre: '',
        releaseDate: '',
        poster: null,
      });
    } catch (error) {
      setMessage(`❌ Error: ${error?.response?.data?.msg || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollArea className="h-screen p-6 bg-gray-100">
      <Card className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-xl">
        <CardContent>
          <h2 className="text-2xl font-semibold mb-4">🎬 Create New Movie</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea name="description" value={form.description} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duration (minutes)</Label>
                <Input type="number" name="duration" value={form.duration} onChange={handleChange} required />
              </div>
              <div>
                <Label>Language</Label>
                <Input name="language" value={form.language} onChange={handleChange} required />
              </div>
            </div>
            <div>
              <Label>Genre (comma-separated)</Label>
              <Input name="genre" value={form.genre} onChange={handleChange} required />
            </div>
            <div>
              <Label>Release Date</Label>
              <Input type="date" name="releaseDate" value={form.releaseDate} onChange={handleChange} required />
            </div>
            <div>
              <Label>Poster</Label>
              <Input type="file" name="poster" accept="image/*" onChange={handleFileChange} required />
            </div>
            <Separator />
            <Button type="submit" disabled={loading} className="w-full text-lg">
              {loading ? 'Uploading...' : 'Create Movie'}
            </Button>
            {message && <p className="text-center mt-4 font-medium text-blue-600">{message}</p>}
          </form>
        </CardContent>
      </Card>
    </ScrollArea>
  );
};

export default CreateMovie;
