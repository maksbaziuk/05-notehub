import css from "./App.module.css";
import { useEffect, useState } from "react";
import { FetchNotes, CreateNote, DeleteNote } from "../../services/noteService";
import toast, { Toaster } from "react-hot-toast";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { CreateNoteRequest } from "../../types/note";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import NoteForm from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const perPage = 12;

function App() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  const { data, error, isLoading } = useQuery({
    queryKey: ["notes", search, page, perPage],
    queryFn: () => FetchNotes({ search, page, perPage }),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: CreateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      setIsModalOpen(false);
      setPage(1);
      toast.success("Note created successfully!");
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: DeleteNote,
    onMutate: (id) => setIsDeletingId(id),
    onSettled: () => setIsDeletingId(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  const handleCreateNote = (values: CreateNoteRequest) => {
    createMutation.mutate(values);
  };
  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  const debounceSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(event.target.value);
    },
    1000
  );

  useEffect(() => {
    if (data && data.notes.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const totalPages = data?.totalPages || 0;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <Toaster position="top-center" />
        <SearchBox search={search} onChange={debounceSearch} />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      <main>
        {error && <ErrorMessage />}
        {isLoading && <Loader />}
        {data && data.notes.length > 0 && (
          <NoteList
            notes={data.notes}
            onDelete={handleDeleteNote}
            isDeletingId={isDeletingId}
          />
        )}
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <NoteForm
          onSubmit={handleCreateNote}
          onCancel={closeModal}
          isLoading={createMutation.isPending}
        />
      </Modal>
    </div>
  );
}

export default App;
function resetForm() {
  throw new Error("Function not implemented.");
}
