import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import type { CreateNoteRequest, NoteTag } from "../../types/note";
import css from "./NoteForm.module.css";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateNote } from "../../services/noteService";

interface NoteFormProps {
  onCancel: () => void;
  onClose: () => void;
}

const INITIAL_VALUES: CreateNoteRequest = {
  title: "",
  content: "",
  tag: "Todo" as NoteTag,
};

const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Must be at least 3 characters")
    .max(50, "Must be 50 characters or less")
    .required("Title is required"),
  content: Yup.string().max(500, "Must be 500 characters or less"),
  tag: Yup.string()
    .oneOf(
      ["Todo", "Work", "Personal", "Meeting", "Shopping"],
      "Tag is not valid"
    )
    .required("Tag is required"),
});

const NoteForm = ({ onCancel, onClose }: NoteFormProps) => {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      toast.success("Note created successfully!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create note");
    },
  });

  const handleSubmit = (
    values: CreateNoteRequest,
    formikHelpers: FormikHelpers<CreateNoteRequest>
  ) => {
    mutate(values, {
      onSuccess: () => {
        formikHelpers.resetForm();
        onClose();
      },
    });
  };

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <fieldset className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage component="span" name="title" className={css.error} />
        </fieldset>

        <fieldset className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage component="span" name="content" className={css.error} />
        </fieldset>

        <fieldset className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage component="span" name="tag" className={css.error} />
        </fieldset>

        <fieldset className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onCancel}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create note"}
          </button>
        </fieldset>
      </Form>
    </Formik>
  );
};

export default NoteForm;
