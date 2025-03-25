// app/image/[id]/page.js
export default async function ImagePage({ params }) {
    const response = await fetch(`/api/images/${params.id}`);
    const image = await response.json();
  
    if (!image) {
      return <div>Image not found</div>;
    }
  
    return (
      <div>
        <h1>{image.name}</h1>
        <img
          src={`data:${image.contentType};base64,${image.image}`}
          alt={image.name}
        />
      </div>
    );
  }