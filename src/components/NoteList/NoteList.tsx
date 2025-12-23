import css from "./NoteList.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteNote } from "../../services/noteService";
import toast from "react-hot-toast";

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();

  const { mutate, variables, isPending } = useMutation({
    mutationFn: DeleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete note");
    },
  });

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => mutate(note.id)}
              disabled={isPending && variables === note.id}
            >
              {isPending && variables === note.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
